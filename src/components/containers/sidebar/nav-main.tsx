'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { IconType } from 'react-icons/lib';
import { LuCirclePlus, LuMail } from 'react-icons/lu';

import { Button } from '@/components/ui/button';
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from '@/components/ui/sidebar';

export function NavMain({
    items
}: {
    items: {
        title: string;
        url: string;
        icon?: IconType;
    }[];
}) {
    const pathname = usePathname();

    return (
        <SidebarGroup>
            <SidebarGroupContent className='flex flex-col gap-2'>
                <SidebarMenu>
                    <SidebarMenuItem className='flex items-center gap-2'>
                        <SidebarMenuButton
                            className='min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground'
                            tooltip='Quick Create'
                        >
                            <LuCirclePlus />
                            <span>Quick Create</span>
                        </SidebarMenuButton>
                        <Button
                            className='size-8 group-data-[collapsible=icon]:opacity-0'
                            size='icon'
                            variant='outline'
                        >
                            <LuMail />
                            <span className='sr-only'>Inbox</span>
                        </Button>
                    </SidebarMenuItem>
                </SidebarMenu>
                <SidebarMenu>
                    {items.map(item => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={pathname === item.url}
                                tooltip={item.title}
                            >
                                <Link href={item.url}>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
