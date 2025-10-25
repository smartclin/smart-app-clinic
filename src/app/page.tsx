// src/app/page.tsx

import { Suspense } from 'react';

import { HydrateClient } from '@/trpc/server';

import { HomeClient } from './home-client';

export default function Home() {
    return (
        <HydrateClient>
            <Suspense fallback={<HomeClient healthCheck={false} />}>
                <HomeClient healthCheck={false} />
            </Suspense>
        </HydrateClient>
    );
}
