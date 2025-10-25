import z from 'zod';

import { protectedProcedure, router } from '@/server/api/trpc';

const roleSchema = z.enum(['patient', 'doctor', 'admin', 'staff']);

export const authRouter = router({
    getSession: protectedProcedure.query(({ ctx }) => {
        const session = ctx;
        const user = ctx.user;
        return { session, user };
    }),

    // Get current user role as lowercase string, default to "patient"
    getRole: protectedProcedure.query(({ ctx }) => {
        const role = ctx.user?.role?.toLowerCase() || 'patient';
        return role;
    }),

    // Check if current user has a specific role
    checkRole: protectedProcedure.input(roleSchema).query(({ input: role, ctx }) => {
        const userRole = ctx.user?.role?.toLowerCase();
        return userRole === role.toLowerCase();
    })
});
