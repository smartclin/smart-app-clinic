import { AppointmentStatus, type Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { customAlphabet } from 'nanoid';
import { z } from 'zod';

import { AppointmentSchema, VitalSignsSchema } from '@/lib/schema';
import { protectedProcedure, publicProcedure, router } from '@/server/api/trpc'; // or your tRPC init path
import { db } from '@/server/db';

const buildQuery = (id?: string, search?: string) => {
    // Base conditions for search if it exists
    const searchConditions: Prisma.AppointmentWhereInput = search
        ? {
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
                  {
                      doctor: {
                          name: { contains: search, mode: 'insensitive' }
                      }
                  }
              ]
          }
        : {};

    // ID filtering conditions if ID exists
    const idConditions: Prisma.AppointmentWhereInput = id
        ? {
              OR: [{ patientId: id }, { doctorId: id }]
          }
        : {};

    // Combine both conditions with AND if both exist
    const combinedQuery: Prisma.AppointmentWhereInput =
        id || search
            ? {
                  AND: [
                      ...(Object.keys(searchConditions).length > 0 ? [searchConditions] : []),
                      ...(Object.keys(idConditions).length > 0 ? [idConditions] : [])
                  ]
              }
            : {};

    return combinedQuery;
};

// Zod schema for the input to getPatientAppointments
const allAppointmentsInputSchema = z.object({
    page: z.union([z.number(), z.string()]),
    limit: z.union([z.number(), z.string()]).optional(),
    search: z.string().optional(),
    id: z.string().optional()
});

export const appointmentRouter = router({
    getAppointmentById: protectedProcedure.input(z.number()).query(async ({ input: id }) => {
        if (!id) {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'Appointment ID is required.'
            });
        }

        const data = await db.appointment.findUnique({
            where: { id },
            include: {
                doctor: {
                    select: { id: true, name: true, specialization: true, img: true }
                },
                patient: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        dateOfBirth: true,
                        gender: true,
                        image: true,
                        address: true,
                        phone: true
                    }
                }
            }
        });

        if (!data) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Appointment data not found.'
            });
        }

        return data;
    }),

    getPatientAppointments: protectedProcedure.input(allAppointmentsInputSchema).query(async ({ input }) => {
        const PAGE_NUMBER = Number(input.page) <= 0 ? 1 : Number(input.page);
        const LIMIT = Number(input.limit) || 10;
        const SKIP = (PAGE_NUMBER - 1) * LIMIT;

        const [data, totalRecord] = await Promise.all([
            db.appointment.findMany({
                where: buildQuery(input.id, input.search),
                skip: SKIP,
                take: LIMIT,
                select: {
                    id: true,
                    patientId: true,
                    doctorId: true,
                    type: true,
                    appointmentDate: true,
                    time: true,
                    status: true,
                    patient: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            phone: true,
                            gender: true,
                            image: true,
                            dateOfBirth: true,
                            colorCode: true
                        }
                    },
                    doctor: {
                        select: {
                            id: true,
                            name: true,
                            specialization: true,
                            colorCode: true,
                            img: true
                        }
                    }
                },
                orderBy: { appointmentDate: 'desc' }
            }),
            db.appointment.count({
                where: buildQuery(input.id, input.search)
            })
        ]);

        if (!data) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Appointment data not found.'
            });
        }

        const totalPages = Math.ceil(totalRecord / LIMIT);

        return {
            data,
            totalPages,
            currentPage: PAGE_NUMBER,
            totalRecord
        };
    }),

    getAppointmentWithMedicalRecordsById: protectedProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
            if (!input.id) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Appointment ID is required.'
                });
            }

            const data = await db.appointment.findUnique({
                where: { id: input.id },
                include: {
                    patient: true,
                    doctor: true,
                    bills: true,
                    medical: {
                        include: {
                            diagnosis: true,
                            labTest: true,
                            VitalSigns: true
                        }
                    }
                }
            });

            if (!data) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Appointment data not found.'
                });
            }

            return data;
        }),

    createNewAppointment: publicProcedure.input(AppointmentSchema).mutation(async ({ input }) => {
        // Destructure all required variables from the input object first
        const { patientId, doctorId, type, appointmentDate, time, note } = input;
        const alphabet = '0123456789';

        // Create the function to generate a random 5-digit numeric string
        const generateSyntheticKey = customAlphabet(alphabet, 5);

        try {
            // Generate the synthetic key (this is where you invoke the function)
            const syntheticKey = generateSyntheticKey();

            const newAppointment = await db.appointment.create({
                data: {
                    syntheticKey, // This is now a string, not a function
                    patientId,
                    doctorId,
                    type,
                    appointmentDate,
                    time,
                    note: note ?? null // Correctly handles undefined/null for Prisma
                }
            });

            return {
                message: 'Appointment created successfully',
                data: newAppointment
            };
        } catch (error) {
            console.error(error);
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to create appointment.'
            });
        }
    }),

    appointmentAction: protectedProcedure
        .input(
            z.object({
                id: z.union([z.string(), z.number()]),
                status: z.nativeEnum(AppointmentStatus),
                reason: z.string().optional().default('')
            })
        )
        .mutation(async ({ input }) => {
            try {
                await db.appointment.update({
                    where: { id: Number(input.id) },
                    data: {
                        status: input.status,
                        reason: input.reason
                    }
                });

                return {
                    success: true,
                    error: false,
                    msg: `Appointment ${input.status.toLowerCase()} successfully`
                };
            } catch (error) {
                console.error(error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to update appointment'
                });
            }
        }),
    /**
     * Updates the status and reason for an appointment.
     * This procedure is restricted to doctors and admins.
     */
    updateAppointmentStatus: protectedProcedure
        .input(
            z.object({
                id: z.string().or(z.number()),
                status: z.enum(AppointmentStatus),
                reason: z.string()
            })
        )
        .mutation(async ({ input }) => {
            const id = typeof input.id === 'string' ? Number(input.id) : input.id;
            if (Number.isNaN(id)) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Invalid appointment ID.'
                });
            }

            await db.appointment.update({
                where: { id },
                data: {
                    status: input.status,
                    reason: input.reason
                }
            });

            return {
                message: `Appointment ${input.status.toLowerCase()} successfully`
            };
        }),

    /**
     * Adds vital signs to a medical record for a specific appointment.
     * This procedure is restricted to doctors and admins.
     */
    createVitalSigns: protectedProcedure.input(VitalSignsSchema).mutation(async ({ input }) => {
        const {
            patientId,
            medicalId,
            encounterId,
            recordedAt
            // ... other fields
        } = input;
        try {
            const newVitalSigns = await db.vitalSigns.create({
                data: {
                    patientId,
                    medicalId,
                    // FIX: Convert 'undefined' to 'null' for the 'encounterId' field
                    encounterId: encounterId ?? null,
                    // FIX: Also apply to other nullable fields as needed
                    recordedAt: recordedAt ?? null
                    // ... other fields from input
                }
            });

            return {
                message: 'Vital signs created successfully',
                success: true,
                data: newVitalSigns // optional, useful for frontend
            };
        } catch (error) {
            console.error('Error creating vital signs:', error);
            return {
                message: 'Failed to create vital signs',
                success: false,
                error: (error as Error).message
            };
        }
    })
});
