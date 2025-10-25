'use client';

import {
    LucideClipboardList,
    LucideDollarSign,
    LucideFileText,
    LucideHome,
    LucideSettings,
    LucideStethoscope,
    LucideUserCheck,
    LucideUsers
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useSession } from '@/lib/auth-client';

import { ModeToggle } from './mode-toggle';
import UserMenu from './user-menu';

export default function Header() {
    const pathname = usePathname();
    const { data: session } = useSession();

    // Determine user role
    const role = session?.user?.role || 'patient';

    // Role-based navigation - updated to match your actual routes
    const roleLinks = {
        admin: [
            { to: '/admin', label: 'Admin Dashboard', icon: LucideClipboardList },
            { to: '/admin/system-settings', label: 'Settings', icon: LucideSettings },
            { to: '/record/patients', label: 'Patients', icon: LucideUserCheck },
            { to: '/record/doctors', label: 'Doctors', icon: LucideStethoscope },
            { to: '/record/staffs', label: 'Staff', icon: LucideUsers },
            { to: '/record/appointments', label: 'Appointments', icon: LucideClipboardList },
            { to: '/record/medical-records', label: 'Records', icon: LucideFileText },
            { to: '/record/billing', label: 'Billing', icon: LucideDollarSign }
        ],
        doctor: [
            { to: '/doctor', label: 'Doctor Dashboard', icon: LucideClipboardList },
            { to: '/record/patients', label: 'Patients', icon: LucideUserCheck },
            { to: '/record/appointments', label: 'Appointments', icon: LucideClipboardList },
            { to: '/record/medical-records', label: 'Records', icon: LucideFileText }
        ],
        patient: [
            { to: '/', label: 'Home', icon: LucideHome },
            { to: '/dashboard', label: 'Dashboard', icon: LucideClipboardList },
            { to: '/record/appointments', label: 'Appointments', icon: LucideClipboardList },
            { to: '/record/medical-records', label: 'Records', icon: LucideFileText }
        ]
    };

    const links = roleLinks[role as keyof typeof roleLinks];

    return (
        <header className='sticky top-0 z-50 w-full bg-white shadow-md'>
            <div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:py-4'>
                {/* Clinic Logo / Brand */}
                <Link
                    className='flex items-center gap-2 font-bold text-primary text-xl'
                    href='/'
                >
                    <span className='flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 font-mono text-white'>
                        P
                    </span>
                    <span>Smart Clinic</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className='hidden gap-4 md:flex'>
                    {links.map(({ to, label, icon: Icon }) => {
                        const isActive = pathname?.startsWith(to);
                        return (
                            <Link
                                className={`flex items-center gap-1 rounded-lg px-3 py-1 font-medium text-sm transition-colors ${isActive ? 'bg-emerald-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                href={to}
                                key={to}
                            >
                                <Icon size={16} />
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right Actions */}
                <div className='flex items-center gap-3'>
                    <ModeToggle />
                    <UserMenu />
                </div>
            </div>

            {/* Mobile Navigation */}
            <nav className='flex gap-2 overflow-x-auto border-gray-200 border-t px-4 py-2 md:hidden'>
                {links.map(({ to, label, icon: Icon }) => {
                    const isActive = pathname?.startsWith(to);
                    return (
                        <Link
                            className={`flex items-center gap-1 whitespace-nowrap rounded-lg px-2 py-1 font-medium text-sm ${isActive ? 'bg-emerald-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                            href={to}
                            key={to}
                        >
                            <Icon size={16} />
                            {label}
                        </Link>
                    );
                })}
            </nav>
        </header>
    );
}
