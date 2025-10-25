'use client';

import { Globe, Moon, Sun } from 'lucide-react';
import Image from 'next/image'; // Import the next/image component
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface HeaderProps {
    className?: string;
}

export function Header({ className, ...props }: HeaderProps) {
    const { setTheme } = useTheme();
    const router = useRouter();
    const pathname = usePathname();

    const handleLanguageChange = (lang: string) => {
        // This is a simplified example. You might have a more complex i18n setup.
        // This logic assumes a path like /en/page or /ar/page
        const newPath = `/${lang}${pathname.substring(3)}`;
        router.push(newPath);
    };

    return (
        <header
            className={cn(
                'flex h-20 w-full items-center justify-between border-b bg-background px-4 py-2 sm:px-8',
                className
            )}
            {...props}
        >
            <div className='flex items-center gap-2'>
                <Link
                    className='flex items-center gap-2 font-bold'
                    href='/'
                >
                    {/* Using next/image for better performance and to fix the lint error */}
                    <Image
                        alt='My Clinic Logo'
                        height={32}
                        src='/images/favicon.svg' // Set the width
                        width={32} // Set the height
                    />
                    <span className='text-xl'>Smart Clinic</span>
                </Link>
            </div>
            <div className='flex items-center gap-2'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            size='icon'
                            variant='ghost'
                        >
                            <Globe className='h-5 w-5' />
                            <span className='sr-only'>Change language</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                        <DropdownMenuItem onClick={() => handleLanguageChange('en')}>English</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleLanguageChange('ar')}>العربية</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            size='icon'
                            variant='ghost'
                        >
                            <Sun className='dark:-rotate-90 h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:scale-0' />
                            <Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
                            <span className='sr-only'>Toggle theme</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                        <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
