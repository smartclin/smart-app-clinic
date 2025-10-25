import type { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { PatientFormSchema } from '@/lib/schema';
import { protectedProcedure, publicProcedure, router } from '@/server/api/trpc';
import { auth } from '@/server/auth';
import { db } from '@/server/db';
import { processAppointments } from '@/types/helper';
import { daysOfWeek } from '@/utils';

export const patientRouter = router({
    getPatientDashboardStatistics: protectedProcedure.input(z.string()).query(async ({ input: id }) => {
        if (!id) {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'Patient ID is required.'
            });
        }

        const data = await db.patient.findUnique({
            where: { id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                gender: true,
                image: true,
                colorCode: true
            }
        });

        if (!data) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Patient data not found.'
            });
        }

        const appointments = await db.appointment.findMany({
            where: { patientId: data?.id },
            include: {
                doctor: {
                    select: {
                        id: true,
                        name: true,
                        img: true,
                        specialization: true,
                        colorCode: true
                    }
                },
                patient: {
                    select: {
                        firstName: true,
                        lastName: true,
                        gender: true,
                        dateOfBirth: true,
                        image: true,
                        colorCode: true
                    }
                }
            },
            orderBy: { appointmentDate: 'desc' }
        });

        const { appointmentCounts, monthlyData } = await processAppointments(appointments);
        const last5Records = appointments.slice(0, 5);
        const today = daysOfWeek[new Date().getDay()];

        const availableDoctor = await db.doctor.findMany({
            select: {
                id: true,
                name: true,
                specialization: true,
                img: true,
                workingDays: true,
                colorCode: true
            },
            where: {
                workingDays: {
                    some: {
                        day: { equals: today ?? '', mode: 'insensitive' }
                    }
                }
            },
            take: 4
        });

        return {
            data,
            appointmentCounts,
            last5Records,
            totalAppointments: appointments.length,
            availableDoctor,
            monthlyData
        };
    }),

    getPatientById: publicProcedure.input(z.string()).query(async ({ input: id }) => {
        const patient = await db.patient.findUnique({
            where: { id }
        });

        if (!patient) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Patient data not found.'
            });
        }

        return patient;
    }),

    getPatientFullDataById: protectedProcedure.input(z.string()).query(async ({ input: id }) => {
        const patient = await db.patient.findFirst({
            where: {
                OR: [{ id }, { email: id }]
            },
            include: {
                _count: { select: { appointments: true } },
                appointments: {
                    select: { appointmentDate: true },
                    orderBy: { appointmentDate: 'desc' },
                    take: 1
                }
            }
        });

        if (!patient) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Patient data not found.'
            });
        }

        // ✅ type-safe thanks to Prisma.PatientGetPayload
        type PatientWithAppointments = Prisma.PatientGetPayload<{
            include: {
                _count: { select: { appointments: true } };
                appointments: { select: { appointmentDate: true } };
            };
        }>;

        const p = patient as PatientWithAppointments;

        const lastVisit: Date | null = patient.appointments[0]?.appointmentDate ?? null;

        return {
            ...p,
            totalAppointments: p._count.appointments,
            lastVisit
        };
    }),

    getAllPatients: protectedProcedure
        .input(
            z.object({
                page: z.union([z.number(), z.string()]),
                limit: z.union([z.number(), z.string()]).optional(),
                search: z.string().optional()
            })
        )
        .query(async ({ input }) => {
            const PAGE_NUMBER = Number(input.page) <= 0 ? 1 : Number(input.page);
            const LIMIT = Number(input.limit) || 10;
            const SKIP = (PAGE_NUMBER - 1) * LIMIT;
            const search = input.search || '';

            const [patients, totalRecords] = await Promise.all([
                db.patient.findMany({
                    where: {
                        OR: [
                            { firstName: { contains: search, mode: 'insensitive' } },
                            { lastName: { contains: search, mode: 'insensitive' } },
                            { phone: { contains: search, mode: 'insensitive' } },
                            { email: { contains: search, mode: 'insensitive' } }
                        ]
                    },
                    include: {
                        appointments: {
                            select: {
                                medical: {
                                    select: { createdAt: true, treatmentPlan: true },
                                    orderBy: { createdAt: 'desc' },
                                    take: 1
                                }
                            },
                            orderBy: { appointmentDate: 'desc' },
                            take: 1
                        }
                    },
                    skip: SKIP,
                    take: LIMIT,
                    orderBy: { firstName: 'asc' }
                }),
                db.patient.count()
            ]);

            const totalPages = Math.ceil(totalRecords / LIMIT);

            return {
                data: patients,
                totalRecords,
                totalPages,
                currentPage: PAGE_NUMBER
            };
        }),

    createNewPatient: protectedProcedure
        .input(
            z.object({
                data: PatientFormSchema,
                pid: z.string()
            })
        )
        .mutation(async ({ input }) => {
            const { data: patientData, pid } = input;
            let patientId = pid;
            let userId = null; // Initialize userId

            try {
                if (pid === 'new-patient') {
                    // Logic for a truly new patient
                    const user = await auth.api.createUser({
                        body: {
                            email: patientData.email,
                            password: patientData.phone, // Assuming phone number is used as a temporary password
                            name: `${patientData.firstName} ${patientData.lastName}`,
                            role: 'patient'
                            // Add nullish coalescing for the image
                        }
                    });
                    userId = user?.user.id;
                    patientId = userId;
                } else {
                    // Logic for updating an existing auth user's image
                    await auth.api.updateUser({
                        body: {
                            // Add a nullish coalescing check for the image field
                            image: patientData.image ?? ''
                        }
                    });
                    userId = pid; // Use pid as the userId for existing patients
                }

                await db.patient.create({
                    data: {
                        // Fix: Explicitly handle each field to convert undefined to null
                        id: patientId,
                        userId,
                        firstName: patientData.firstName,
                        lastName: patientData.lastName,
                        dateOfBirth: patientData.dateOfBirth,
                        gender: patientData.gender,
                        phone: patientData.phone,
                        email: patientData.email,
                        address: patientData.address,
                        nutritionalStatus: patientData.nutritionalStatus,
                        bloodGroup: patientData.bloodGroup ?? null,
                        allergies: patientData.allergies ?? null,
                        image: patientData.image ?? null,
                        medicalHistory: patientData.medicalHistory ?? null
                    }
                });

                return { message: 'Patient created successfully' };
            } catch (error) {
                console.error(error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to create new patient.'
                });
            }
        }),

    updatePatient: protectedProcedure
        .input(
            z.object({
                data: PatientFormSchema,
                pid: z.string()
            })
        )
        .mutation(async ({ input }) => {
            const { data: patientData, pid } = input;

            try {
                // Update auth user's name
                await auth.api.updateUser({
                    body: {
                        name: `${patientData.firstName} ${patientData.lastName}`,
                        // Also update the image here
                        image: patientData.image ?? ''
                    }
                });

                await db.patient.update({
                    data: {
                        // Fix: Explicitly handle each field to convert undefined to null
                        firstName: patientData.firstName,
                        lastName: patientData.lastName,
                        dateOfBirth: patientData.dateOfBirth,
                        gender: patientData.gender,
                        phone: patientData.phone,
                        email: patientData.email,
                        address: patientData.address,
                        nutritionalStatus: patientData.nutritionalStatus,
                        bloodGroup: patientData.bloodGroup ?? null,
                        allergies: patientData.allergies ?? null,
                        image: patientData.image ?? null,
                        medicalHistory: patientData.medicalHistory ?? null
                    },
                    where: { id: pid }
                });

                return { message: 'Patient updated successfully' };
            } catch (error) {
                console.error(error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to update patient.'
                });
            }
        })
});
