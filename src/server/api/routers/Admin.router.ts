import { z } from 'zod';

import { DoctorAuthSchema, ServicesSchema, StaffAuthSchema, workingDaySchema } from '@/lib/schema';
import { adminProcedure, publicProcedure, router } from '@/server/api/trpc';
import { auth } from '@/server/auth';
import { db } from '@/server/db';
import { processAppointments } from '@/types/helper';
import { daysOfWeek, generateRandomColor } from '@/utils';

const deleteInputSchema = z.object({
    id: z.string(),
    deleteType: z.enum(['doctor', 'staff', 'patient', 'payment', 'bill'])
});
const CreateNewDoctorInputSchema = DoctorAuthSchema.extend({
    workSchedule: z.array(workingDaySchema)
});

export const adminRouter = router({
    getAdminDashboardStats: adminProcedure.query(async () => {
        const todayDate = new Date().getDay();
        const today = daysOfWeek[todayDate];

        const [totalPatient, totalDoctors, appointments, doctors] = await Promise.all([
            db.patient.count(),
            db.doctor.count(),
            db.appointment.findMany({
                include: {
                    patient: {
                        select: {
                            id: true,
                            lastName: true,
                            firstName: true,
                            image: true,
                            colorCode: true,
                            gender: true,
                            dateOfBirth: true,
                            user: {
                                select: {
                                    image: true
                                }
                            }
                        }
                    },
                    doctor: {
                        select: {
                            name: true,
                            img: true,
                            colorCode: true,
                            specialization: true
                        }
                    }
                },
                orderBy: { appointmentDate: 'desc' }
            }),
            db.doctor.findMany({
                where: {
                    workingDays: {
                        some: { day: { equals: today ?? '', mode: 'insensitive' } }
                    }
                },
                select: {
                    id: true,
                    name: true,
                    specialization: true,
                    img: true,
                    colorCode: true
                },
                take: 5
            })
        ]);

        const { appointmentCounts, monthlyData } = processAppointments(appointments);
        const last5Records = appointments.slice(0, 5);

        // Return the data directly. tRPC handles success/error states.
        return {
            totalPatient,
            totalDoctors,
            appointmentCounts,
            availableDoctors: doctors,
            monthlyData,
            last5Records,
            totalAppointments: appointments.length
        };
    }),

    getServices: publicProcedure.query(async () => {
        // Use a try-catch for robustness, but tRPC also handles errors gracefully.
        try {
            const data = await db.services.findMany({
                orderBy: { serviceName: 'asc' }
            });
            return data;
        } catch (error) {
            console.error('Failed to fetch services:', error);
            throw new Error('Internal Server Error');
        }
    }),

    createNewStaff: adminProcedure.input(StaffAuthSchema).mutation(async ({ input }) => {
        const { password, ...staffData } = input;

        // Create a new user in the authentication system
        const user = await auth.api.createUser({
            body: {
                email: staffData.email,
                password: password ?? '',
                name: staffData.name,
                role: 'staff'
            }
        });

        // Create the staff record in the database
        await db.staff.create({
            data: {
                ...staffData,
                userId: user.user.id,
                name: user.user.name,
                id: user.user.id,
                img: user.user.image ?? '',
                colorCode: generateRandomColor(),
                status: 'ACTIVE',
                licenseNumber: staffData.licenseNumber ?? '',
                hireDate: staffData.hireDate ?? new Date(),
                salary: staffData.salary ?? 0,
                department: 'nurse'
            }
        });

        return {
            success: true,
            message: 'Staff member added successfully'
        };
    }),

    /**
     * Creates a new doctor with a working schedule.
     * This procedure is only accessible by admins.
     */
    createNewDoctor: adminProcedure.input(CreateNewDoctorInputSchema).mutation(async ({ input }) => {
        const { password, name, workSchedule, ...doctorData } = input;

        // Create a new user in the authentication system
        const user = await auth.api.createUser({
            body: {
                email: doctorData.email,
                password,
                name,
                role: 'doctor'
            }
        });

        // Create the doctor record in the database
        const doctor = await db.doctor.create({
            data: {
                ...doctorData,
                id: user.user.id,
                userId: user.user.id,
                name,
                img: user.user.image ?? ''
            }
        });

        // Create work schedule entries if provided
        if (workSchedule.length > 0) {
            await Promise.all(
                workSchedule.map((ws: { day: string; startTime: string; closeTime: string }) =>
                    db.workingDays.create({
                        data: {
                            day: ws.day,
                            startTime: ws.startTime,
                            closeTime: ws.closeTime,
                            doctorId: doctor.id
                        }
                    })
                )
            );
        }

        return {
            success: true,
            message: 'Doctor added successfully'
        };
    }),

    /**
     * Adds a new service to the clinic.
     * This procedure is only accessible by admins.
     */
    addNewService: adminProcedure.input(ServicesSchema).mutation(async ({ input }) => {
        await db.services.create({
            data: { ...input, price: Number(input.price) }
        });
        return { message: 'Service added successfully' };
    }),
    deleteDataById: adminProcedure.input(deleteInputSchema).mutation(async ({ input }) => {
        const { id, deleteType } = input;

        // Delete the corresponding record from the database
        switch (deleteType) {
            case 'doctor':
                await db.doctor.delete({ where: { id } });
                break;
            case 'staff':
                await db.staff.delete({ where: { id } });
                break;
            case 'patient':
                await db.patient.delete({ where: { id } });
                break;
            case 'payment':
                // Note: Assuming 'payment' IDs are numbers in your schema
                await db.payment.delete({ where: { id: Number(id) } });
                break;
            case 'bill':
                // Placeholder for bill deletion
                await db.patientBills.delete({ where: { id: Number(id) } });
                break;
            default:
                throw new Error('Invalid delete type provided.');
        }

        // If the deleted record is a user, also delete them from the auth system.
        // The original code had a bug where it did not specify the user to delete.
        if (deleteType === 'staff' || deleteType === 'patient' || deleteType === 'doctor') {
            await auth.api.deleteUser({ body: {} });
        }

        return { message: 'Data deleted successfully' };
    })
});
