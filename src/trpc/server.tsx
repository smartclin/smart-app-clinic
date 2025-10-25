import 'server-only'; // Ensure no server-side code gets executed client-side.

import {
    dehydrate,
    type FetchInfiniteQueryOptions,
    type FetchQueryOptions,
    HydrationBoundary
} from '@tanstack/react-query'; // Correct import for React Query hydration
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { cache } from 'react';

import { appRouter } from '@/server/api/root'; // Ensure appRouter is correctly exported
import { createTRPCContext } from '@/server/api/trpc'; // Adjust path if necessary

import { makeQueryClient } from './query-client'; // Ensure query-client.ts exists

// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
export const getQueryClient = cache(makeQueryClient);

export const trpc = createTRPCOptionsProxy({
    ctx: createTRPCContext,
    router: appRouter,
    queryClient: getQueryClient
});

export const api = appRouter.createCaller(createTRPCContext);

export function HydrateClient({ children }: { children: React.ReactNode }) {
    const queryClient = getQueryClient();

    return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}

export function prefetch<
    T extends
        | FetchQueryOptions<unknown, Error, unknown, [string, { type: 'other' | 'infinite' }], unknown>
        | FetchInfiniteQueryOptions<unknown, Error, unknown, [string, { type: 'other' | 'infinite' }], unknown>
>(queryOptions: T) {
    const queryClient = getQueryClient();

    if (queryOptions.queryKey[1]?.type === 'infinite') {
        // If it's an infinite query, make sure to pass initialPageParam
        void queryClient.prefetchInfiniteQuery(queryOptions as FetchInfiniteQueryOptions);
    } else {
        void queryClient.prefetchQuery(queryOptions as FetchQueryOptions);
    }
}
