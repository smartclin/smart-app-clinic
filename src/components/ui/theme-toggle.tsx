'use client';

import { LaptopIcon, MoonStarIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export default function ThemeToggle() {
    const { setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    data-testid='theme-toggle'
                    size='icon'
                    variant='outline'
                >
                    <SunIcon className='dark:-rotate-90 h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:scale-0' />
                    <MoonStarIcon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
                    <span className='sr-only'>Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align='end'
                data-testid='theme-dropdown-content'
            >
                <DropdownMenuItem
                    data-testid='theme-light'
                    onClick={() => {
                        setTheme('light');
                    }}
                >
                    <SunIcon className='mr-2 h-[1.2rem] w-[1.2rem]' />
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem
                    data-testid='theme-dark'
                    onClick={() => {
                        setTheme('dark');
                    }}
                >
                    <MoonStarIcon className='mr-2 h-[1.2rem] w-[1.2rem]' />
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem
                    data-testid='theme-system'
                    onClick={() => {
                        setTheme('system');
                    }}
                >
                    <LaptopIcon className='mr-2 h-[1.2rem] w-[1.2rem]' />
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
