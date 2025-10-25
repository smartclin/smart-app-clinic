'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { IconType } from 'react-icons/lib';
import { LuEllipsis, LuFolder, LuForward, LuTrash } from 'react-icons/lu';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar
} from '@/components/ui/sidebar';

export function NavDocuments({
    items
}: {
    items: {
        name: string;
        url: string;
        icon: IconType;
    }[];
}) {
    const { isMobile } = useSidebar();
    const pathname = usePathname();

    return (
        <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
            <SidebarGroupLabel>Documents</SidebarGroupLabel>
            <SidebarMenu>
                {items.map(item => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                            asChild
                            isActive={pathname === item.url}
                        >
                            <Link href={item.url}>
                                <item.icon />
                                <span>{item.name}</span>
                            </Link>
                        </SidebarMenuButton>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuAction
                                    className='rounded-sm data-[state=open]:bg-accent'
                                    showOnHover
                                >
                                    <LuEllipsis />
                                    <span className='sr-only'>More</span>
                                </SidebarMenuAction>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align={isMobile ? 'end' : 'start'}
                                className='w-24 rounded-lg'
                                side={isMobile ? 'bottom' : 'right'}
                            >
                                <DropdownMenuItem>
                                    <LuFolder />
                                    <span>Open</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <LuForward />
                                    <span>Share</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem variant='destructive'>
                                    <LuTrash />
                                    <span>Delete</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                    <SidebarMenuButton className='text-sidebar-foreground/70'>
                        <LuEllipsis className='text-sidebar-foreground/70' />
                        <span>More</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    );
}
