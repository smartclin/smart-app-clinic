'use client';

import type { ThemeProviderProps } from 'next-themes';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

import EStorageKeys from '@/constants/key';

export default function ThemeProvider({ children, ...properties }: Readonly<ThemeProviderProps>) {
    return (
        <NextThemesProvider
            attribute='class'
            defaultTheme='system'
            disableTransitionOnChange
            enableSystem
            storageKey={EStorageKeys.theme}
            {...properties}
        >
            {children}
        </NextThemesProvider>
    );
}
