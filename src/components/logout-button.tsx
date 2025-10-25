'use client';

import { LogOutIcon } from 'lucide-react';

import { authClient } from '@/lib/auth-client';

import { Button } from './ui/button';

export const LogoutButton = () => {
    const handleSignOut = async () => {
        await authClient.signOut();
    };
    return (
        <Button
            className='bottom-0 w-fit gap-2 px-0 md:px-4'
            onClick={handleSignOut}
            variant={'outline'}
        >
            <LogOutIcon />
            <span className='hidden lg:block'>Logout</span>
        </Button>
    );
};
