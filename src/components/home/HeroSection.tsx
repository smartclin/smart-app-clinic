// components/home/HeroSection.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export function HeroSection() {
    return (
        <section className='bg-gradient-to-br from-blue-50 to-pink-50 py-20 md:py-28'>
            <div className='container mx-auto max-w-7xl px-4 text-center md:px-8'>
                <motion.h1
                    animate={{ opacity: 1, y: 0 }}
                    className='font-extrabold text-4xl text-gray-900 tracking-tight sm:text-5xl md:text-6xl'
                    initial={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.6 }}
                >
                    Manage Your Pediatric Clinic with <span className='text-blue-600'>Ease</span>
                </motion.h1>
                <motion.p
                    animate={{ opacity: 1, y: 0 }}
                    className='mx-auto mt-6 max-w-2xl text-gray-600 text-lg sm:text-xl'
                    initial={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                >
                    PediaFlow is the all-in-one solution designed specifically for pediatric practices to streamline
                    operations, enhance patient care, and grow your clinic.
                </motion.p>
                <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className='mt-8 flex justify-center space-x-4'
                    initial={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <Link
                        className='rounded-full bg-blue-600 px-8 py-3 font-semibold text-lg text-white shadow-lg transition-transform duration-200 hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                        href='/signup'
                    >
                        Start Your Free Trial
                    </Link>
                    <Link
                        className='rounded-full border border-gray-300 bg-white px-8 py-3 font-semibold text-gray-700 text-lg shadow-md transition-transform duration-200 hover:scale-105 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2'
                        href='#features'
                    >
                        Learn More
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
