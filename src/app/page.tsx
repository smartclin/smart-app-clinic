// src/app/page.tsx

import { api, HydrateClient } from '@/trpc/server';

import { HomeClient } from './home-client';

export default async function Home() {
    // Health check variable declaration
    let healthCheck: boolean;

    try {
        // Direct API call without prefetch - simpler and more reliable
        const healthResult = await api.healthCheck();
        healthCheck = healthResult?.toLowerCase() === 'ok';
    } catch (error) {
        console.error('Health check failed:', error);
        healthCheck = false;
    }

    return (
        <HydrateClient>
            {/* Pass healthCheck status to the client component */}
            <HomeClient healthCheck={healthCheck} />
        </HydrateClient>
    );
}
