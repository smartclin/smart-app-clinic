// no "use client" here
import type { Gender } from '@prisma/client';
import { Suspense } from 'react';

import { getSession } from '@/server/auth/utils';
import { api, HydrateClient } from '@/trpc/server';
import type { AppointmentStatus } from '@/types/data-types';
import { checkRole } from '@/utils/roles';
import { DATA_LIMIT } from '@/utils/seetings';

import AppointmentsClient, { type AppointmentItem } from './client';

export default async function AppointmentsPage(props: {
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const { searchParams } = props;
    const session = await getSession();
    const userId = session?.user.id;
    const userRole = session?.user.role?.toUpperCase();

    const isPatient = checkRole(session, 'PATIENT');

    const safePage = Math.max(Number(searchParams?.['p'] ?? 1), 1);
    const searchQuery = typeof searchParams?.['q'] === 'string' ? searchParams['q'] : '';
    const id = typeof searchParams?.['id'] === 'string' ? searchParams['id'] : undefined;

    const queryId =
        userRole === 'ADMIN'
            ? id
            : userRole === 'DOCTOR' || userRole === 'STAFF'
              ? (id ?? userId)
              : userRole === 'PATIENT'
                ? userId
                : undefined;

    let appointmentsResponse;
    try {
        appointmentsResponse = await api.appointment.getPatientAppointments({
            page: safePage,
            search: searchQuery,
            id: queryId,
            limit: DATA_LIMIT
        });
    } catch (error) {
        return (
            <div className='flex h-screen items-center justify-center text-red-500'>
                Error: {(error as Error).message}
            </div>
        );
    }

    // Ensure TypeScript knows the type
    const validAppointments: AppointmentItem[] = (appointmentsResponse?.data ?? [])
        .filter((item): item is NonNullable<typeof item> => item.status !== null && item.patient !== null)
        .map(item => ({
            ...item,
            status: item.status as AppointmentStatus,
            patient: {
                ...(item.patient ?? ''),
                img: item.patient?.image ?? null,
                dateOfBirth: item.patient?.dateOfBirth ?? new Date(),
                gender: item.patient?.gender as Gender
            }
        }));

    if (!validAppointments.length) {
        return <div className='flex h-screen items-center justify-center text-gray-500'>No appointments found.</div>;
    }

    return (
        <HydrateClient>
            <Suspense fallback={<div>Loading appointments...</div>}>
                <AppointmentsClient
                    currentPage={appointmentsResponse.currentPage}
                    data={validAppointments}
                    isPatient={isPatient}
                    totalPages={appointmentsResponse.totalPages}
                    totalRecord={appointmentsResponse.totalRecord}
                    userId={userId}
                />
            </Suspense>
        </HydrateClient>
    );
}
