'use client';

import { Bell } from 'lucide-react'; // import your Bell icon
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { authClient } from '@/lib/auth-client';

import UserToggle from './common/user-toggle';
import { Skeleton } from './ui/skeleton';
import { UserButton } from './user-button';

const ThemeToggle = dynamic(() => import('./ui/theme-toggle'), {
    loading: () => <Skeleton className='h-10 w-10 rounded-md' />
});

export const Navbar = () => {
    const { data: session } = authClient.useSession();
    const user = session?.user;
    const pathname = usePathname();

    const formatPathName = (pathname: string) => {
        if (!pathname) return 'Overview';
        const splitRoute = pathname.split('/');
        const lastIndex = splitRoute.length - 1 > 2 ? 2 : splitRoute.length - 1;
        const pathName = splitRoute[lastIndex];
        return pathName?.replace(/-/g, ' ') ?? '';
    };
    const path = formatPathName(pathname);

    const rootSegment = pathname?.split('/')[1] || '';
    const clinicName = 'Smart Clinic Hurghada';

    const navLabel = (() => {
        switch (rootSegment) {
            case 'admin':
                return 'Admin Dashboard';
            case 'doctor':
                return 'Doctor Portal';
            case 'patient':
                return 'Patient Management';
            case 'record':
                return 'Medical Records';
            case 'auth':
                return 'Authentication';
            case 'dashboard':
                return 'Dashboard';
            default:
                return clinicName;
        }
    })();

    return (
        <header className='flex h-16 items-center justify-between border-border border-b bg-white px-5 dark:bg-gray-900'>
            {/* Left: Logo / Branding */}
            <Link
                className='font-extrabold text-gray-900 text-lg dark:text-white'
                href='/'
            >
                {clinicName}
            </Link>

            {/* Center: Path & Label */}
            <div className='flex flex-col items-center'>
                <h1 className='font-medium text-gray-500 text-xl capitalize'>{path || 'Overview'}</h1>
                <span className='hidden font-semibold text-gray-700 md:block dark:text-gray-300'>{navLabel}</span>
            </div>

            {/* Right: Controls */}
            <div className='flex items-center gap-4'>
                {/* Notifications */}
                <div className='relative'>
                    <Bell className='h-5 w-5 text-gray-600 dark:text-gray-300' />
                    <span className='-top-2 -right-1 absolute flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] text-white'>
                        2
                    </span>
                </div>

                {/* Theme toggle */}
                <ThemeToggle />

                {/* User toggle */}
                <UserToggle />

                {/* Optional UserButton */}
                {user?.id && <UserButton />}
            </div>
        </header>
    );
};
