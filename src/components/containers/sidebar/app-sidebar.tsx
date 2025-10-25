'use client';

import type * as React from 'react';
import {
    LuAudioWaveform,
    LuBadgeHelp,
    LuChartBar,
    LuCircleGauge,
    LuClipboardMinus,
    LuCommand,
    LuDatabase,
    LuFolder,
    LuGalleryVerticalEnd,
    LuLayoutList,
    LuSearch,
    LuSettings,
    LuUsers,
    LuWholeWord
} from 'react-icons/lu';

import { TeamSwitcher } from '@/components/common/team-switcher';
import { NavDocuments } from '@/components/containers/sidebar/nav-documents';
import { NavMain } from '@/components/containers/sidebar/nav-main';
import { NavSecondary } from '@/components/containers/sidebar/nav-secondary';
import { NavUser } from '@/components/containers/sidebar/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import { APP_ROUTES } from '@/constants/app-routes';

const data = {
    teams: [
        {
            name: 'Acme Inc',
            logo: LuGalleryVerticalEnd,
            plan: 'Enterprise'
        },
        {
            name: 'Acme Corp.',
            logo: LuAudioWaveform,
            plan: 'Startup'
        },
        {
            name: 'Evil Corp.',
            logo: LuCommand,
            plan: 'Free'
        }
    ],
    navMain: [
        {
            title: 'Dashboard',
            url: APP_ROUTES.DASHBOARD.ROOT,
            icon: LuCircleGauge
        },
        {
            title: 'Lifecycle',
            url: '#',
            icon: LuLayoutList
        },
        {
            title: 'Analytics',
            url: '#',
            icon: LuChartBar
        },
        {
            title: 'Projects',
            url: '#',
            icon: LuFolder
        },
        {
            title: 'Users',
            url: APP_ROUTES.DASHBOARD.USERS,
            icon: LuUsers
        }
    ],
    navSecondary: [
        {
            title: 'Settings',
            url: '#',
            icon: LuSettings
        },
        {
            title: 'Get Help',
            url: '#',
            icon: LuBadgeHelp
        },
        {
            title: 'Search',
            url: '#',
            icon: LuSearch
        }
    ],
    documents: [
        {
            name: 'Data Library',
            url: '#',
            icon: LuDatabase
        },
        {
            name: 'Reports',
            url: '#',
            icon: LuClipboardMinus
        },
        {
            name: 'Word Assistant',
            url: '#',
            icon: LuWholeWord
        }
    ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar
            collapsible='offcanvas'
            {...props}
        >
            <SidebarHeader>
                <TeamSwitcher teams={data.teams} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavDocuments items={data.documents} />
                <NavSecondary
                    className='mt-auto'
                    items={data.navSecondary}
                />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
