import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

import { appRouter } from '@/server/api/root';
import { createTRPCContext } from '@/server/api/trpc';

// ✅ Type helpers
export type AppRouter = typeof appRouter;
export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

// ✅ Create test caller
export const createTestCaller = async () => {
    const ctx = await createTRPCContext(); // mock no auth
    return appRouter.createCaller(ctx);
};
