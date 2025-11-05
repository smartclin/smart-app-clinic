import '@/styles/globals.css';

import type { Metadata, Viewport } from 'next';
import { Footer } from 'react-day-picker';

import Header from '@/components/header';
import { env } from '@/env';
import Providers from '@/providers';
import { geistMono, geistSans } from '@/styles/fonts';

// ========= Metadata =========
export const metadata: Metadata = {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: {
        default: 'Smart Pediatric Clinic',
        template: '%s | Smart Pediatric Clinic'
    },
    description:
        'Your trusted pediatric clinic — providing expert, compassionate care for children of all ages. From checkups to vaccinations and specialized treatments.',
    openGraph: {
        title: 'Smart Pediatric Clinic',
        description:
            'Expert pediatric care in a welcoming environment. Trusted by families for comprehensive child health services.',
        url: env.NEXT_PUBLIC_APP_URL,
        siteName: 'Smart Pediatric Clinic',
        images: [
            {
                url: '/images/clinic-logo.png',
                width: 512,
                height: 512,
                alt: 'Smart Pediatric Clinic logo'
            }
        ],
        locale: 'en_US',
        type: 'website'
    },
    icons: {
        icon: [
            { url: '/favicon.ico', type: 'image/x-icon' },
            { url: '/favicon-light.ico', media: '(prefers-color-scheme: light)' },
            { url: '/favicon-dark.ico', media: '(prefers-color-scheme: dark)' }
        ],
        apple: [{ url: '/apple-touch-icon.png' }]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Smart Pediatric Clinic',
        description: 'Your trusted pediatric clinic — exceptional care for every child.',
        images: ['/images/clinic-logo.png']
    }
};

// ========= Viewport (for mobile & PWA) =========
export const viewport: Viewport = {
    themeColor: '#22c55e', // Tailwind's green-500
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1
};

// ========= Layout =========
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            lang='en'
            suppressHydrationWarning
        >
            <body className='min-h-screen bg-white text-gray-800 transition-colors duration-300 dark:bg-gray-900 dark:text-gray-100'>
                <Providers>
                    <div className='flex min-h-screen flex-col'>
                        {/* Global header (sticky on top) */}
                        <Header />

                        {/* Main content */}
                        <main className='flex-1 px-4 py-6 sm:px-6 lg:px-8'>
                            {children}
                            <Footer />
                        </main>
                    </div>
                </Providers>
            </body>
        </html>
    );
}
