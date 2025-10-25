// components/home/FinalCTA.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export function FinalCTA() {
    return (
        <section className='bg-blue-600 py-20'>
            <div className='container mx-auto max-w-7xl px-4 text-center text-white md:px-8'>
                <motion.h2
                    className='font-bold text-3xl sm:text-4xl'
                    initial={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.4 }}
                    viewport={{ once: true }}
                    whileInView={{ opacity: 1, y: 0 }}
                >
                    Ready to Take Control of Your Clinic?
                </motion.h2>
                <motion.p
                    className='mx-auto mt-4 max-w-2xl text-lg'
                    initial={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    viewport={{ once: true }}
                    whileInView={{ opacity: 1, y: 0 }}
                >
                    Join hundreds of pediatric clinics who have streamlined their operations and improved their patient
                    care with PediaFlow.
                </motion.p>
                <motion.div
                    className='mt-8'
                    initial={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    viewport={{ once: true }}
                    whileInView={{ opacity: 1, y: 0 }}
                >
                    <Link
                        className='rounded-full bg-white px-10 py-4 font-semibold text-blue-600 text-lg shadow-xl transition-transform duration-200 hover:scale-105 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2'
                        href='/sign-up'
                    >
                        Sign Up Now
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
