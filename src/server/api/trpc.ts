import { initTRPC, TRPCError } from '@trpc/server';
import { headers } from 'next/headers';
import { cache } from 'react';
import superjson from 'superjson';
import z, { ZodError } from 'zod';

import { db } from '@/server/db';

import { auth } from '../auth';

export const createTRPCContext = cache(async (opts?: { headers?: Headers }) => {
    /**
     * @see: https://trpc.io/docs/server/context
     */
    const headersList = opts?.headers ?? (await headers());
    const session = await auth.api.getSession({ headers: headersList });

    return {
        db,
        session,
        user: session?.user
            ? {
                  id: session.user.id,
                  role: session.user.role
              }
            : null
    };
});

// export const createTRPCContext = async (opts: { headers: Headers }) => {
//   return {
//     db,
//     ...opts,
//   };
// };

const t = initTRPC.context<typeof createTRPCContext>().create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
        let zodErrorDetails = null;

        // Check if the error is a ZodError and then use the treeifyError function
        if (error.cause instanceof ZodError) {
            zodErrorDetails = z.treeifyError(error.cause); // Use the new treeifyError method
        }

        return {
            ...shape,
            data: {
                ...shape.data,
                zodError: zodErrorDetails // Add the treeified error details
            }
        };
    }
});

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

export const procedure = t.procedure;
export const createTRPCRouter = t.router;
export const router = t.router;
/**
 * Middleware for timing procedure execution and adding an artificial delay in development.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
    const start = Date.now();

    if (t._config.isDev) {
        // artificial delay in dev
        const waitMs = Math.floor(Math.random() * 400) + 100;
        await new Promise(resolve => setTimeout(resolve, waitMs));
    }

    const result = await next();

    const end = Date.now();
    console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

    return result;
});

export const publicProcedure = t.procedure.use(timingMiddleware);
const authMiddleware = t.middleware(async ({ next, ctx }) => {
    const { user } = ctx;

    if (!user) {
        console.log('Auth middleware: No session found');
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Authentication required'
        });
    }

    return next({ ctx: { ...ctx, user } });
});

const adminMiddleware = t.middleware(async ({ next, ctx }) => {
    const { user } = ctx;
    if (!user) {
        console.log('Admin middleware: No session found');
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Authentication required'
        });
    }

    if (user.role !== 'admin') {
        console.log('Admin middleware: User is not admin, role:', user.role);
        throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Admin access required'
        });
    }

    return next({ ctx: { ...ctx, user } });
});

// export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(authMiddleware);
export const adminProcedure = t.procedure.use(adminMiddleware);
