'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { getQueryClient } from '@/trpc/server';

import { ThemeProvider } from './theme-provider';
import { Toaster } from './ui/sonner';

export default function Providers({ children }: { children: React.ReactNode }) {
    const queryClient = getQueryClient();

    return (
        <ThemeProvider
            attribute='class'
            defaultTheme='system'
            disableTransitionOnChange
            enableSystem
        >
            <QueryClientProvider client={queryClient}>
                {children}
                <ReactQueryDevtools />
            </QueryClientProvider>
            <Toaster richColors />
        </ThemeProvider>
    );
}
