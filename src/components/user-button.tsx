'use client';

import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

interface UserButtonProps {
    user?: {
        name?: string | null;
        email?: string | null;
    } | null;
}

export function UserButton({ user }: UserButtonProps) {
    const router = useRouter();

    const handleSignOut = async () => {
        await authClient.signOut();
        router.refresh();
    };

    if (!user) {
        return (
            <Button
                asChild
                variant='outline'
            >
                <Link href='/login'>{'login'}</Link>
            </Button>
        );
    }

    return (
        <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
                {user.name && <p className='font-medium text-sm'>{user.name}</p>}
                {user.email && <p className='text-muted-foreground text-xs'>{user.email}</p>}
            </div>

            <Button
                className='cursor-pointer'
                onClick={handleSignOut}
                size='icon'
                variant='ghost'
            >
                <LogOut className='h-4 w-4' />
                <span className='sr-only'>{'logout'}</span>
            </Button>
        </div>
    );
}
