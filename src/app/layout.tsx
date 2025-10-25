import '@/styles/globals.css';

import type { Metadata } from 'next';
import { Toaster } from 'sonner'; // Toast notifications

import Header from '@/components/header';
import { ThemeProvider } from '@/components/theme-provider'; // For consistent theme styling
import { env } from '@/env'; // For environmental variables
import { geistMono, geistSans } from '@/styles/fonts';
import { TRPCReactProvider } from '@/trpc/react'; // Ensure trpc context is available

export const metadata: Metadata = {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: 'Pediatric Clinic',
    description:
        'Your trusted pediatric clinic, providing expert care for children of all ages. From routine checkups to specialized treatments.',
    openGraph: {
        images: [
            {
                url: '/images/clinic-logo.png' // Update with your clinic's logo
            }
        ]
    },
    icons: {
        icon: [
            {
                rel: 'icon',
                media: '(prefers-color-scheme: dark)',
                url: '/favicon.ico'
            },
            {
                rel: 'icon',
                media: '(prefers-color-scheme: light)',
                url: '/favicon-light.ico'
            }
        ]
    }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            lang='en'
            suppressHydrationWarning
        >
            <head>
                {/* Add your meta tags or other head elements */}
                {/* Example for adding custom scripts or links */}
                {/* <script crossOrigin="anonymous" src="//unpkg.com/react-scan/dist/auto.global.js" /> */}
            </head>
            <body className='bg-white text-gray-800 dark:bg-gray-900 dark:text-white'>
                {/* Wrapping the entire app in TRPC context provider */}
                <TRPCReactProvider>
                    {/* Theme provider for consistent theming */}
                    <ThemeProvider>
                        {/* The Toaster is used for displaying notifications */}
                        <Toaster
                            position='bottom-right'
                            richColors
                        />
                        <Header />
                        {/* Main app content */}
                        {children}
                    </ThemeProvider>
                </TRPCReactProvider>
            </body>
        </html>
    );
}
