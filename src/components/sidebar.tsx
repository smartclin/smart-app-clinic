'use client';

import type { LucideIcon } from 'lucide-react';
import {
    BellIcon,
    LayoutDashboardIcon,
    ListIcon,
    ListOrderedIcon,
    LogsIcon,
    PillIcon,
    ReceiptIcon,
    SettingsIcon,
    SquareActivityIcon,
    UserIcon,
    UserRoundIcon,
    UsersIcon,
    UsersRoundIcon
} from 'lucide-react';
import Link from 'next/link';

import type { UserRoles } from '@/utils/roles';

import { LogoutButton } from './logout-button';

const ACCESS_LEVELS_ALL = ['ADMIN', 'DOCTOR', 'STAFF', 'PATIENT'] as const;

type Role = (typeof ACCESS_LEVELS_ALL)[number];

type SidebarLink = {
    name: string;
    href: string;
    access: Role[]; // only roles from ACCESS_LEVELS_ALL
    icon: LucideIcon;
};

type SidebarSection = {
    label: string;
    links: SidebarLink[];
};

const SIDEBAR_LINKS: SidebarSection[] = [
    {
        label: 'MENU',
        links: [
            {
                name: 'Dashboard',
                href: '/',
                access: [...ACCESS_LEVELS_ALL],
                icon: LayoutDashboardIcon
            },
            {
                name: 'Profile',
                href: '/patient/self',
                access: ['PATIENT'],
                icon: UserIcon
            }
        ]
    },
    {
        label: 'Manage',
        links: [
            {
                name: 'Users',
                href: '/record/users',
                access: ['ADMIN'],
                icon: UsersIcon
            },
            {
                name: 'Doctors',
                href: '/record/doctors',
                access: ['ADMIN'],
                icon: UserIcon
            },
            {
                name: 'Staffs',
                href: '/record/staffs',
                access: ['ADMIN', 'DOCTOR'],
                icon: UserRoundIcon
            },
            {
                name: 'Patients',
                href: '/record/patients',
                access: ['ADMIN', 'DOCTOR', 'STAFF'],
                icon: UsersRoundIcon
            },
            {
                name: 'Appointments',
                href: '/record/appointments',
                access: ['ADMIN', 'DOCTOR', 'STAFF'],
                icon: ListOrderedIcon
            },
            {
                name: 'Medical Records',
                href: '/record/medical-records',
                access: ['ADMIN', 'DOCTOR', 'STAFF'],
                icon: SquareActivityIcon
            },
            {
                name: 'Billing Overview',
                href: '/record/billing',
                access: ['ADMIN', 'DOCTOR'],
                icon: ReceiptIcon
            },
            {
                name: 'Patient Management',
                href: '/nurse/patient-management',
                access: ['STAFF'],
                icon: UsersIcon
            },
            {
                name: 'Administer Medications',
                href: '/nurse/administer-medications',
                access: ['ADMIN', 'DOCTOR', 'STAFF'],
                icon: PillIcon
            },
            {
                name: 'Appointments',
                href: '/record/appointments',
                access: ['PATIENT'],
                icon: ListOrderedIcon
            },
            {
                name: 'Records',
                href: '/patient/self',
                access: ['PATIENT'],
                icon: ListIcon
            },
            {
                name: 'Prescription',
                href: '#',
                access: ['PATIENT'],
                icon: PillIcon
            },
            {
                name: 'Billing',
                href: '/patient/self?cat=payments',
                access: ['PATIENT'],
                icon: ReceiptIcon
            }
        ]
    },
    {
        label: 'System',
        links: [
            {
                name: 'Notifications',
                href: '/notifications',
                access: [...ACCESS_LEVELS_ALL],
                icon: BellIcon
            },
            {
                name: 'Audit Logs',
                href: '/admin/audit-logs',
                access: ['ADMIN'],
                icon: LogsIcon
            },
            {
                name: 'Settings',
                href: '/admin/system-settings',
                access: ['ADMIN'],
                icon: SettingsIcon
            }
        ]
    }
];

const SidebarIcon = ({ icon: Icon }: { icon: LucideIcon }) => {
    return <Icon className='size-6 lg:size-5' />;
};

interface SidebarProps {
    role?: UserRoles;
}

export const Sidebar = ({ role = 'PATIENT' }: SidebarProps) => {
    return (
        <div className='flex min-h-full w-full flex-col justify-between gap-4 overflow-y-scroll bg-white p-4'>
            <div>
                <div className='flex items-center justify-center gap-2 lg:justify-start'>
                    <div className='rounded-md bg-blue-600 p-1.5 text-white'>
                        <SquareActivityIcon size={22} />
                    </div>
                    <Link
                        className='hidden font-bold text-base lg:flex 2xl:text-xl'
                        href='/'
                    >
                        Kinda HMS
                    </Link>
                </div>

                <div className='mt-4 text-sm'>
                    {SIDEBAR_LINKS.map(section => (
                        <div
                            className='flex flex-col gap-2'
                            key={section.label}
                        >
                            <span className='my-4 hidden font-bold text-gray-400 uppercase lg:block'>
                                {section.label}
                            </span>

                            {section.links
                                .filter(link => link.access.includes(role))
                                .map(link => (
                                    <Link
                                        className='flex items-center justify-center gap-4 rounded-md py-2 text-gray-500 hover:bg-blue-600/10 md:px-2 lg:justify-start'
                                        href={link.href}
                                        key={link.name}
                                    >
                                        <SidebarIcon icon={link.icon} />
                                        <span className='hidden lg:block'>{link.name}</span>
                                    </Link>
                                ))}
                        </div>
                    ))}
                </div>
            </div>

            <LogoutButton />
        </div>
    );
};
