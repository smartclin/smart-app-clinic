'use client';

import type { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { httpBatchStreamLink, loggerLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import type { PropsWithChildren } from 'react';
import { useState } from 'react';
import SuperJSON from 'superjson';

import type { AppRouter } from '@/server/api/root';
import { makeQueryClient } from '@/trpc/query-client';
import { getUrl } from '@/utils/type';

let clientQueryClientSingleton: QueryClient | undefined;

const getQueryClient = () => {
    if (typeof globalThis === 'undefined') {
        // server: always create a new query client
        return makeQueryClient();
    }
    // browser: keep the same query client
    if (!clientQueryClientSingleton) {
        clientQueryClientSingleton = makeQueryClient();
    }
    return clientQueryClientSingleton;
};

export const api = createTRPCReact<AppRouter>();
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

type TTRPCProviderProps = PropsWithChildren;

export function TRPCProvider({ children }: Readonly<TTRPCProviderProps>) {
    const queryClient = getQueryClient();

    const [trpcClient] = useState(() =>
        api.createClient({
            links: [
                loggerLink({
                    enabled: op =>
                        process.env.NODE_ENV === 'development' ||
                        (op.direction === 'down' && op.result instanceof Error)
                }),
                httpBatchStreamLink({
                    transformer: SuperJSON,
                    url: `${getUrl()}/api/trpc`,
                    headers: () => {
                        const headers = new Headers();
                        headers.set('x-trpc-source', 'nextjs-react');
                        return headers;
                    }
                })
            ]
        })
    );

    return (
        <QueryClientProvider client={queryClient}>
            <api.Provider
                client={trpcClient}
                queryClient={queryClient}
            >
                {children}
                <ReactQueryDevtools initialIsOpen={false} />
            </api.Provider>
        </QueryClientProvider>
    );
}
