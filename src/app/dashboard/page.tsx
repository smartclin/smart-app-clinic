'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { trpc } from '@/trpc/react';

export default function Dashboard() {
    const router = useRouter();

    // Session
    const { data: session, isPending: isSessionPending } = authClient.useSession();

    // Role data (only fetch if session exists)
    const { data: roleData, isLoading: isRoleLoading } = trpc.auth.getRole.useQuery(undefined, {
        enabled: !!session?.user
    });

    // Example private data fetch
    const { data: privateData } = trpc.privateData.useQuery(undefined, {
        enabled: !!session?.user
    });

    // Redirect unauthenticated users
    useEffect(() => {
        if (!isSessionPending && !session) {
            router.push('/login');
        }
    }, [session, isSessionPending, router]);

    // Redirect authenticated users to their role-specific dashboard
    useEffect(() => {
        if (session?.user && roleData) {
            router.push(`/${roleData.toLowerCase()}`);
        }
    }, [session, roleData, router]);

    // Loading state
    if (isSessionPending || (session?.user && isRoleLoading)) {
        return (
            <div className='flex h-screen items-center justify-center bg-gray-50'>
                <div className='animate-pulse text-gray-700 text-lg'>Loading your dashboard...</div>
            </div>
        );
    }

    return (
        <div className='flex min-h-screen flex-col items-center justify-center bg-white px-6 py-12'>
            <header className='mb-12 text-center'>
                <h1 className='font-bold text-4xl text-gray-800 md:text-5xl'>Welcome to</h1>
                <h2 className='mt-2 font-extrabold text-5xl text-blue-700 md:text-6xl'>Smart Clinic</h2>
                <p className='mt-4 text-gray-600 md:text-lg'>Pediatric & Lactation Care Management System</p>
            </header>

            <main className='flex max-w-xl flex-col items-center justify-center gap-6 text-center'>
                <p className='text-gray-700'>
                    Manage patient records, appointments, and lactation consultations efficiently and securely. Access
                    your dashboard to start exploring clinic features.
                </p>

                <div className='flex flex-wrap justify-center gap-4'>
                    {session?.user ? (
                        <Link href={`/${roleData?.toLowerCase()}`}>
                            <Button className='px-6 py-3 text-lg'>Go to Dashboard</Button>
                        </Link>
                    ) : (
                        <>
                            <Link href='/signup'>
                                <Button className='px-6 py-3 font-medium text-lg'>Register as New Patient</Button>
                            </Link>
                            <Link href='/login'>
                                <Button
                                    className='border-blue-700 px-6 py-3 text-blue-700 text-lg hover:bg-blue-50'
                                    variant='outline'
                                >
                                    Login to Account
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </main>

            {privateData && <p className='mt-4 text-gray-500 text-sm'>Private Data: {privateData.message}</p>}

            <footer className='mt-16 text-center text-gray-500 text-sm'>
                &copy; 2025 Smart Clinic Pediatric & Lactation Management. All rights reserved.
            </footer>
        </div>
    );
}
