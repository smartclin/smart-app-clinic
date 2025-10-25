'use client';

import { useRouter } from 'next/router';
import { LuBell, LuCircleUserRound, LuCreditCard, LuEllipsisVertical, LuLogOut } from 'react-icons/lu';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { APP_ROUTES } from '@/constants/app-routes';
import { useSession } from '@/hooks/use-auth';
import { authClient } from '@/lib/auth-client';
import { getInitials } from '@/utils';

export function NavUser() {
    const { isMobile } = useSidebar();
    const router = useRouter();
    const session = useSession();
    const user = session.data?.user;
    if (!session.data) {
        return null;
    }
    const onLogout = async () => {
        await authClient.signOut();
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                            size='lg'
                        >
                            <Avatar className='h-8 w-8 rounded-lg'>
                                <AvatarImage
                                    alt={session.data.user?.name}
                                    src={user?.image || ''}
                                />
                                <AvatarFallback className='rounded-lg'>{getInitials(user?.name || '')}</AvatarFallback>
                            </Avatar>
                            <div className='grid flex-1 text-left text-sm leading-tight'>
                                <span className='truncate font-medium'>{user?.name}</span>
                                <span className='truncate text-muted-foreground text-xs'>{user?.email}</span>
                            </div>
                            <LuEllipsisVertical className='ml-auto size-4' />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align='end'
                        className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
                        side={isMobile ? 'bottom' : 'right'}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className='p-0 font-normal'>
                            <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                                <Avatar className='h-8 w-8 rounded-lg'>
                                    <AvatarImage
                                        alt={user?.name}
                                        src={user?.image || ''}
                                    />
                                    <AvatarFallback className='rounded-lg'>
                                        {getInitials(user?.name || '')}
                                    </AvatarFallback>
                                </Avatar>
                                <div className='grid flex-1 text-left text-sm leading-tight'>
                                    <span className='truncate font-medium'>{user?.name}</span>
                                    <span className='truncate text-muted-foreground text-xs'>{user?.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => router.push(APP_ROUTES.DASHBOARD.ACCOUNT)}>
                                <LuCircleUserRound />
                                Account
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <LuCreditCard />
                                Billing
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <LuBell />
                                Notifications
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={onLogout}>
                            <LuLogOut />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
