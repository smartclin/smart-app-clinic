'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { cn } from '@/lib/utils';

interface ThemeToggleProps {
    className?: string;
    size?: number;
    strokeWidth?: number;
}

export function ThemeToggle({ size = 20, strokeWidth = 2, className }: ThemeToggleProps) {
    const { setTheme, resolvedTheme } = useTheme();

    const toggleTheme = () => {
        const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';

        if (!document.startViewTransition) {
            setTheme(newTheme);
        } else {
            document.startViewTransition(() => setTheme(newTheme));
        }
    };

    return (
        <button
            aria-label='Toggle theme'
            className={cn(className, 'cursor-pointer')}
            onClick={toggleTheme}
            type='button'
        >
            <Sun
                absoluteStrokeWidth
                className='dark:hidden'
                size={size}
                strokeWidth={strokeWidth}
            />
            <Moon
                absoluteStrokeWidth
                className='hidden dark:block'
                size={size}
                strokeWidth={strokeWidth}
            />
        </button>
    );
}
