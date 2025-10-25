'use client';

import { MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react';
import Link from 'next/link';
import { useId } from 'react';

export function Footer() {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { name: 'Doctor', href: '/doctor' },
        { name: 'Patient', href: '/patient' },
        { name: 'Record', href: '/record' },
        { name: 'Privacy Policy', href: '/legal/privacy' },
        { name: 'Terms of Service', href: '/legal/terms' }
    ];
    const footerId = useId();

    return (
        <footer
            className='bg-gray-800 py-12 text-white'
            id={footerId}
        >
            <div className='container mx-auto max-w-7xl px-4 md:px-8'>
                <div className='grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4'>
                    <div className='space-y-4'>
                        <Link
                            className='flex items-center space-x-2 font-bold text-2xl text-white'
                            href='/'
                        >
                            <span>PediaFlow</span>
                        </Link>
                        <p className='text-gray-400 text-sm'>
                            The all-in-one solution for modern pediatric clinic management.
                        </p>
                    </div>

                    <div>
                        <h3 className='mb-4 font-semibold text-lg'>Quick Links</h3>
                        <ul className='space-y-2 text-gray-400 text-sm'>
                            {quickLinks.map(link => (
                                <li key={link.name}>
                                    <Link
                                        className='hover:text-white focus:outline-none focus:ring-2 focus:ring-white'
                                        href={link.href}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className='mb-4 font-semibold text-lg'>Contact Us</h3>
                        <ul className='space-y-2 text-gray-400 text-sm'>
                            <li className='flex items-start space-x-2'>
                                <MapPinIcon className='mt-0.5 h-4 w-4 flex-shrink-0' />
                                <address className='not-italic'>
                                    123 Pediatric Ave,
                                    <br /> Health City, HC 12345
                                </address>
                            </li>
                            <li className='flex items-center space-x-2'>
                                <MailIcon className='h-4 w-4 flex-shrink-0' />
                                <a
                                    className='hover:text-white focus:outline-none focus:ring-2 focus:ring-white'
                                    href='mailto:info@pediaflow.com'
                                >
                                    info@pediaflow.com
                                </a>
                            </li>
                            <li className='flex items-center space-x-2'>
                                <PhoneIcon className='h-4 w-4 flex-shrink-0' />
                                <span>(123) 456-7890</span>
                            </li>
                        </ul>
                    </div>

                    {/* The 'Status' section was removed as it contained undefined variables in the original.
                        You can add new content here if needed.
                    */}
                    <div>
                        <h3 className='mb-4 font-semibold text-lg'>Stay Connected</h3>
                        <p className='text-gray-400 text-sm'>Follow us on social media for updates.</p>
                        {/* Add social media icons/links here if applicable */}
                    </div>
                </div>
                <div className='mt-8 border-gray-700 border-t pt-6 text-center text-gray-500 text-sm'>
                    &copy; {currentYear} PediaFlow. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
