'use client';

import type { AppointmentStatus } from '@prisma/client';
import { EllipsisVerticalIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { getSession } from '@/lib/auth-server';
import { checkRole } from '@/utils/roles';

import { AppointmentActionDialog } from './appointment-action-dialog';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

type ActionsProps = {
    userId: string;
    status: AppointmentStatus;
    patientId: string;
    doctorId: string;
    appointmentId: number;
};

export const AppointmentActionOptions = ({ patientId, doctorId, status, appointmentId }: ActionsProps) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSession() {
            const session = await getSession();
            setUserId(session?.user?.id ?? null);
            const adminCheck = await checkRole(session, 'ADMIN');
            setIsAdmin(adminCheck);
        }
        fetchSession();
    }, []);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    className='flex items-center justify-center rounded-full p-1'
                    variant='outline'
                >
                    <EllipsisVerticalIcon
                        className='text-gray-500 text-sm'
                        size={16}
                    />
                </Button>
            </PopoverTrigger>

            <PopoverContent className='w-56 p-3'>
                <div className='flex flex-col items-start space-y-3'>
                    <span className='text-gray-400 text-xs'>Perform Actions</span>
                    <Button
                        asChild
                        className='w-full justify-start'
                        size='sm'
                        variant='ghost'
                    >
                        <Link href={`appointments/${appointmentId}`}>
                            <UserIcon size={16} /> View Full Details
                        </Link>
                    </Button>

                    {status !== 'SCHEDULED' && (
                        <AppointmentActionDialog
                            disabled={isAdmin || userId === doctorId}
                            id={appointmentId}
                            type='approve'
                        />
                    )}
                    <AppointmentActionDialog
                        disabled={status === 'PENDING' && (isAdmin || userId === doctorId || userId === patientId)}
                        id={appointmentId}
                        type='cancel'
                    />
                </div>
            </PopoverContent>
        </Popover>
    );
};
