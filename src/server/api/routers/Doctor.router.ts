import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { startOfDay } from 'date-fns';
import { z } from 'zod';

import { adminProcedure, publicProcedure, router } from '@/server/api/trpc'; // adjust import path
import { db } from '@/server/db';
import { processAppointments } from '@/types/helper';
import { daysOfWeek } from '@/utils';

// Input schemas

// Router

export const doctorRouter = router({
    // Returns all doctors - no pagination
    getDoctors: publicProcedure.query(async () => {
        const data = await db.doctor.findMany();
        return { data };
    }),

    // Paginated & filtered list of doctors
    getAllDoctors: publicProcedure
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

            const [doctors, totalRecords] = await Promise.all([
                db.doctor.findMany({
                    where: {
                        OR: [
                            { name: { contains: search, mode: 'insensitive' } },
                            { specialization: { contains: search, mode: 'insensitive' } },
                            { email: { contains: search, mode: 'insensitive' } }
                        ]
                    },
                    include: { workingDays: true },
                    skip: SKIP,
                    take: LIMIT
                }),
                db.doctor.count()
            ]);

            const totalPages = Math.ceil(totalRecords / LIMIT);

            return {
                data: doctors,
                totalRecords,
                totalPages,
                currentPage: PAGE_NUMBER
            };
        }),
    getDoctorDashboardStats: adminProcedure.query(async ({ ctx }) => {
        const user = ctx.user;

        // Check if the user is a doctor
        const isDoctor = await db.doctor.findUnique({
            where: { userId: user?.id ?? '' }
        });

        if (!isDoctor) {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'You are not authorized to view this dashboard.'
            });
        }
        const buildWhereClause = (today: string): Prisma.DoctorWhereInput => {
            return {
                workingDays: {
                    some: {
                        day: {
                            equals: today,
                            mode: Prisma.QueryMode.insensitive
                        }
                    }
                }
            };
        };

        // ... In your procedure
        const todayDate = new Date().getDay();
        const today = daysOfWeek[todayDate];
        const whereClause = buildWhereClause(today ?? '');
        const [totalPatient, totalNurses, appointments, doctors] = await Promise.all([
            db.patient.count(),
            db.staff.count({ where: { role: 'STAFF' } }),
            db.appointment.findMany({
                where: {
                    doctorId: user?.id ?? '',
                    appointmentDate: {
                        gte: startOfDay(new Date())
                    }
                },
                include: {
                    patient: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            gender: true,
                            dateOfBirth: true,
                            colorCode: true,
                            image: true,
                            user: {
                                select: {
                                    image: true
                                }
                            }
                        }
                    },
                    doctor: {
                        select: {
                            id: true,
                            name: true,
                            specialization: true,
                            img: true,
                            colorCode: true
                        }
                    }
                },
                orderBy: { appointmentDate: 'desc' }
            }),
            db.doctor.findMany({
                where: whereClause,

                select: {
                    id: true,
                    name: true,
                    specialization: true,
                    img: true,
                    colorCode: true,
                    workingDays: true
                },
                take: 5
            })
        ]);

        const { appointmentCounts, monthlyData } = await processAppointments(appointments);
        const last5Records = appointments.slice(0, 5);

        return {
            totalNurses,
            totalPatient,
            appointmentCounts,
            last5Records,
            availableDoctors: doctors,
            totalAppointment: appointments?.length,
            monthlyData
        };
    }),

    getDoctorById: publicProcedure.input(z.string()).query(async ({ input: id }) => {
        const [doctor, totalAppointment] = await Promise.all([
            db.doctor.findUnique({
                where: { id },
                include: {
                    workingDays: true,
                    appointments: {
                        include: {
                            patient: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    gender: true,
                                    image: true,
                                    colorCode: true
                                }
                            },
                            doctor: {
                                select: {
                                    name: true,
                                    specialization: true,
                                    img: true,
                                    colorCode: true
                                }
                            }
                        },
                        orderBy: { appointmentDate: 'desc' },
                        take: 10
                    }
                }
            }),
            db.appointment.count({
                where: { doctorId: id }
            })
        ]);

        if (!doctor) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Doctor not found'
            });
        }

        return { data: doctor, totalAppointment };
    }),

    getAvailableDoctors: publicProcedure.query(async () => {
        const todayDate = new Date().getDay();
        const today = daysOfWeek[todayDate];

        const doctors = await db.doctor.findMany({
            where: {
                workingDays: {
                    some: { day: { equals: today ?? '', mode: 'insensitive' } }
                },
                availabilityStatus: 'available'
            },
            select: {
                id: true,
                name: true,
                specialization: true,
                img: true,
                colorCode: true,
                workingDays: true
            },
            take: 3
        });
        return { data: doctors };
    })
});
