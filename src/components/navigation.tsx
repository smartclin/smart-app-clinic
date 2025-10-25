'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function Navigation() {
    const t = useTranslations('navigation');
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigationItems = [
        { href: '/', label: t('home') },
        { href: '/about', label: t('about') },
        { href: '/services', label: t('services') },
        { href: '/contact', label: t('contact') }
    ];

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className='bg-white shadow-lg'>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                <div className='flex h-16 justify-between'>
                    {/* Logo */}
                    <div className='flex items-center'>
                        <Link
                            className='flex flex-shrink-0 items-center'
                            href='/'
                        >
                            <span className='font-bold text-gray-800 text-xl'>HNU</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className='hidden items-center space-x-8 md:flex'>
                        {navigationItems.map(item => (
                            <Link
                                className={`rounded-md px-3 py-2 font-medium text-sm transition-colors ${
                                    pathname === item.href
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                }`}
                                href={item.href}
                                key={item.href}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Language Switcher */}
                    <div className='flex items-center space-x-4'>
                        <div className='flex items-center space-x-2'>
                            <Link
                                className={`rounded-md px-3 py-2 font-medium text-sm transition-colors ${
                                    pathname.includes('/en') || !pathname.includes('/ar')
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                }`}
                                href={pathname}
                            >
                                EN
                            </Link>
                            <Link
                                className={`rounded-md px-3 py-2 font-medium text-sm transition-colors ${
                                    pathname.includes('/ar')
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                }`}
                                href={pathname}
                            >
                                عربي
                            </Link>
                        </div>

                        {/* Mobile menu button */}
                        <button
                            className='inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset md:hidden'
                            onClick={toggleMenu}
                            type='button'
                        >
                            <span className='sr-only'>Open main menu</span>
                            {isMenuOpen ? (
                                <svg
                                    className='block h-6 w-6'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                    xmlns='http://www.w3.org/2000/svg'
                                >
                                    <title>Path</title>
                                    <path
                                        d='M6 18L18 6M6 6l12 12'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className='block h-6 w-6'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                    xmlns='http://www.w3.org/2000/svg'
                                >
                                    <title>Path</title>
                                    <path
                                        d='M4 6h16M4 12h16M4 18h16'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className='md:hidden'>
                        <div className='space-y-1 px-2 pt-2 pb-3 sm:px-3'>
                            {navigationItems.map(item => (
                                <Link
                                    className={`block rounded-md px-3 py-2 font-medium text-base transition-colors ${
                                        pathname === item.href
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                    }`}
                                    href={item.href}
                                    key={item.href}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
