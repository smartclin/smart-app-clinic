import type { PropsWithChildren } from 'react';

import { AuthProvider } from '@/components/providers/auth-provider';
import ThemeProvider from '@/components/providers/theme-provider';
import { TRPCProvider } from '@/components/providers/trpc-provider';
import { ThemeToastContainer } from '@/components/theme/toast-container';

type TRootProvider = PropsWithChildren;

export default function RootProvider({ children }: Readonly<TRootProvider>) {
    return (
        <TRPCProvider>
            <AuthProvider auth={{ user: null, session: null }}>
                <ThemeProvider>{children}</ThemeProvider>
                <ThemeToastContainer />
            </AuthProvider>
        </TRPCProvider>
    );
}
