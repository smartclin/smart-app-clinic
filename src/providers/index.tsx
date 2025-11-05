'use client';

import NextTopLoader from 'nextjs-toploader';

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { TRPCReactProvider } from '@/trpc/react';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <TRPCReactProvider>
            <ThemeProvider
                attribute='class'
                defaultTheme='system'
                enableSystem
            >
                <NextTopLoader
                    color='var(--primary)'
                    easing='ease'
                    showSpinner={false}
                />

                {children}

                <Toaster
                    position='bottom-right'
                    richColors
                />
            </ThemeProvider>
        </TRPCReactProvider>
    );
}
