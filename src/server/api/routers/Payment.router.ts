import type { Payment as PaymentPrismaType, Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { AddNewBillInputSchema, DiagnosisSchema, PaymentSchema } from '@/lib/schema';
import { adminProcedure, protectedProcedure, router } from '@/server/api/trpc'; // adjust import path
import { db } from '@/server/db';

const AddDiagnosisInputSchema = DiagnosisSchema.extend({
    appointmentId: z.number() // string id of appointment
});

export const paymentsRouter = router({
    getPaymentRecords: adminProcedure
        .input(
            z.object({
                page: z.union([z.number(), z.string()]),
                limit: z.union([z.number(), z.string()]).optional(),
                search: z.string().optional()
            })
        )
        .query(async ({ input }) => {
            try {
                const PAGE_NUMBER = Number(input.page) <= 0 ? 1 : Number(input.page);
                const LIMIT = Number(input.limit) || 10;
                const SKIP = (PAGE_NUMBER - 1) * LIMIT;
                const search = input.search || '';

                const where: Prisma.PaymentWhereInput = {
                    OR: [
                        {
                            patient: {
                                firstName: { contains: search, mode: 'insensitive' }
                            }
                        },
                        {
                            patient: {
                                lastName: { contains: search, mode: 'insensitive' }
                            }
                        },
                        { patientId: { contains: search, mode: 'insensitive' } }
                    ]
                };

                const [data, totalRecords] = await Promise.all([
                    db.payment.findMany({
                        where,
                        include: {
                            patient: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                    dateOfBirth: true,
                                    image: true,
                                    colorCode: true,
                                    gender: true
                                }
                            }
                        },
                        skip: SKIP,
                        take: LIMIT,
                        orderBy: { createdAt: 'desc' }
                    }),
                    db.payment.count({ where })
                ]);

                const totalPages = Math.ceil(totalRecords / LIMIT);

                return {
                    data,
                    totalRecords,
                    totalPages,
                    currentPage: PAGE_NUMBER
                };
            } catch (error) {
                console.error(error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to retrieve payment records.'
                });
            }
        }),

    addDiagnosis: protectedProcedure.input(AddDiagnosisInputSchema).mutation(async ({ input }) => {
        const { appointmentId, ...validatedData } = input;
        let medicalRecord = null;

        if (!validatedData.medicalId) {
            medicalRecord = await db.medicalRecords.create({
                data: {
                    patientId: validatedData.patientId,
                    doctorId: validatedData.doctorId,
                    appointmentId: appointmentId
                }
            });
        }

        const medId = validatedData.medicalId || medicalRecord?.id;
        if (typeof medId !== 'number') {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Medical Record ID is invalid or missing.'
            });
        }

        await db.diagnosis.create({
            data: {
                medicalId: input.medicalId,
                patientId: input.patientId,
                doctorId: input.doctorId,
                symptoms: input.symptoms,
                diagnosis: input.diagnosis,
                // Fix: Explicitly convert undefined to null
                notes: input.notes ?? null,
                prescribedMedications: input.prescribedMedications ?? null,
                followUpPlan: input.followUpPlan ?? null
            }
        });

        return {
            success: true,
            message: 'Bill added successfully'
        };
    }),

    addNewBill: protectedProcedure.input(AddNewBillInputSchema).mutation(async ({ input }) => {
        let billInfo: PaymentPrismaType | null | undefined = null;

        // If no billId is provided, find or create one
        if (input.billId === undefined || input.billId === null) {
            const info = await db.appointment.findUnique({
                where: { id: input.appointmentId },
                select: {
                    id: true,
                    patientId: true,
                    bills: true
                }
            });

            if (!info || !info.patientId) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Appointment or patient not found for billing.'
                });
            }

            if (info.bills.length === 0) {
                billInfo = await db.payment.create({
                    data: {
                        appointmentId: info.id,
                        patientId: info.patientId,
                        billDate: new Date(),
                        paymentDate: new Date(),
                        discount: 0.0,
                        amountPaid: 0.0,
                        totalAmount: 0.0
                    }
                });
            } else {
                billInfo = info.bills[0];
            }
        } else {
            // If a billId is provided, find the existing bill
            billInfo = await db.payment.findUnique({
                where: { id: input.billId }
            });
        }

        if (!billInfo) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Existing bill not found with provided ID.'
            });
        }

        await db.patientBills.create({
            data: {
                billId: billInfo.id,
                serviceId: Number(input.serviceId),
                serviceDate: new Date(input.serviceDate),
                quantity: Number(input.quantity),
                unitCost: Number(input.unitCost),
                totalCost: Number(input.totalCost)
            }
        });

        return {
            success: true,
            message: 'Bill added successfully'
        };
    }),

    generateBill: protectedProcedure.input(PaymentSchema).mutation(async ({ input }) => {
        const discountAmount = (Number(input.discount) / 100) * Number(input.totalAmount);

        const res = await db.payment.update({
            data: {
                billDate: input.billDate,
                discount: discountAmount,
                totalAmount: Number(input.totalAmount)
            },
            where: { id: Number(input.id) }
        });

        await db.appointment.update({
            data: {
                status: 'COMPLETED'
            },
            where: { id: res.appointmentId }
        });

        return { message: 'Bill generated successfully' };
    })
});
