// src/server/api/routers/health.ts

import z from 'zod';

import { procedure, publicProcedure, router } from '../trpc';

export const healthRouter = router({
    sayHello: procedure
        .meta({ /* 👉 */ description: 'This shows in the panel.' })
        .input(z.object({ name: z.string() }))
        .query(({ input }) => {
            return { greeting: `Hello ${input.name}!` };
        }),
    healthCheck: publicProcedure.query(async () => {
        try {
            // Example: check database connection or external services
            const dbStatus = true; // replace with real DB check if needed
            const externalAPIStatus = true; // replace with real API check

            const healthy = dbStatus && externalAPIStatus;

            return {
                healthy,
                services: {
                    database: dbStatus ? 'ok' : 'down',
                    externalAPI: externalAPIStatus ? 'ok' : 'down'
                }
            };
        } catch (_err) {
            return {
                healthy: false,
                services: {
                    database: 'down',
                    externalAPI: 'down'
                }
            };
        }
    })
});
