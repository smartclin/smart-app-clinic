import { createCallerFactory, createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';

import { adminRouter } from './routers/Admin.router';
import { appointmentRouter } from './routers/Appointment.router';
import { authRouter } from './routers/auth.route';
import { doctorRouter } from './routers/Doctor.router';
import { healthRouter } from './routers/Health';
import { medicalRecordsRouter } from './routers/MedicalRecords.router';
import { patientRouter } from './routers/Patient.router';
import { paymentsRouter } from './routers/Payment.router';
import { staffRouter } from './routers/Staff.router';
import { todoRouter } from './routers/todo';
import { vitalSignsRouter } from './routers/VitalSigns.router';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    healthCheck: publicProcedure.meta({ description: 'Check API connectivity' }).query(() => 'OK'),

    // Protected procedure
    privateData: protectedProcedure.meta({ description: 'Return private user info' }).query(({ ctx }) => ({
        message: 'This is private',
        user: ctx.user
    })),
    health: healthRouter,
    todo: todoRouter,
    auth: authRouter,
    vitalSigns: vitalSignsRouter,
    staff: staffRouter,
    payment: paymentsRouter,
    patient: patientRouter,
    medicalRecords: medicalRecordsRouter,
    doctor: doctorRouter,
    appointment: appointmentRouter,
    admin: adminRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
