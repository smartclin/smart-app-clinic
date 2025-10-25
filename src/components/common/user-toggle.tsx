'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { route } from '@/constants/routes';
import { signOut, useSession } from '@/lib/auth-client';

import { Skeleton } from '../ui/skeleton';
import LucideIcon from './lucide';

export default function UserToggle() {
    const { isPending, data: session } = useSession();

    const router = useRouter();
    const onSignOutClick = useCallback(() => {
        void signOut({
            fetchOptions: {
                onSuccess: () => {
                    toast.success('Sign out successful');
                    router.refresh();
                }
            }
        });
    }, [router]);

    if (isPending) {
        return <Skeleton className='size-9 rounded-md' />;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    size='icon'
                    variant='outline'
                >
                    <LucideIcon name='User' />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {session ? (
                    <DropdownMenuItem
                        onClick={onSignOutClick}
                        variant='destructive'
                    >
                        Sign out
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem>
                        <Link href={route.signIn ?? '/signin'}>Sign in</Link>
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
