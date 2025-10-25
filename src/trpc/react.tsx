'use client';

import { type QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import superjson from 'superjson';

import type { AppRouter } from '@/server/api/root'; // Your root app router

import { makeQueryClient } from './query-client';

export const api = createTRPCReact<AppRouter>();
export const trpc = api;
/**
 * Inference helpers for inputs and outputs.
 */
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

let browserQueryClient: QueryClient;

function getQueryClient() {
    if (typeof window === 'undefined') {
        // Server-side: Create a new query client on each request.
        return makeQueryClient();
    }

    // Client-side: Create a query client only once.
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
}

function getUrl() {
    const base = (() => {
        if (typeof window !== 'undefined') return '';
        if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
        return 'http://localhost:3000'; // Local fallback
    })();
    return `${base}/api/trpc`; // Adjust URL for your API
}

export function TRPCReactProvider({ children }: { children: React.ReactNode }) {
    const queryClient = getQueryClient();

    // Directly create the TRPC client without using useState for performance
    const trpcClient = createTRPCClient<AppRouter>({
        links: [
            httpBatchLink({
                transformer: superjson,
                url: getUrl()
            })
        ]
    });

    return (
        <QueryClientProvider client={queryClient}>
            <api.Provider
                client={trpcClient}
                queryClient={queryClient}
            >
                {children}
            </api.Provider>
        </QueryClientProvider>
    );
}
