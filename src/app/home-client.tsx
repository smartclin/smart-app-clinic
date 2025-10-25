// src/components/home/HomeClient.tsx
'use client'; // Ensure that this file is treated as a client component

import { motion } from 'framer-motion';

import Footer from '@/components/footer';
import { ClinicPoster } from '@/components/home/ClinicPoster';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { FinalCTA } from '@/components/home/FinalCTA';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { TITLE_TEXT } from '@/constants/text';

type Props = {
    healthCheck: boolean;
};

export const HomeClient = ({ healthCheck }: Props) => {
    return (
        <motion.div
            animate={{ opacity: 1, y: 0 }}
            className='min-h-screen bg-linear-to-br from-blue-50 via-white to-cyan-50'
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <div className='container mx-auto max-w-6xl space-y-12 px-4 py-8'>
                {/* Hero / Title */}
                <motion.section
                    animate={{ opacity: 1 }}
                    className='space-y-6 text-center'
                    initial={{ opacity: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <motion.pre
                        animate={{ opacity: 1 }}
                        className='mx-auto overflow-x-auto rounded-2xl border border-blue-100 bg-blue-50/50 p-6 text-center font-mono text-blue-700 text-sm backdrop-blur-sm'
                        initial={{ opacity: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        {TITLE_TEXT}
                    </motion.pre>

                    <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 10 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h1 className='mb-4 font-bold text-4xl text-gray-900 md:text-5xl'>Smart Pediatric Clinic</h1>
                        <p className='mx-auto max-w-2xl text-gray-600 text-xl'>
                            Providing exceptional healthcare for children in Hurghada with modern, compassionate medical
                            services
                        </p>
                    </motion.div>
                </motion.section>

                {/* Clinic Poster */}
                <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 20 }}
                    transition={{ delay: 0.5 }}
                >
                    <ClinicPoster />
                </motion.div>

                {/* System Status */}
                <motion.section
                    animate={{ opacity: 1, y: 0 }}
                    className='flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-lg'
                    initial={{ opacity: 0, y: 10 }}
                    transition={{ delay: 0.7 }}
                >
                    <div className='flex items-center justify-between'>
                        <div>
                            <h2 className='font-semibold text-gray-900 text-lg'>System Status</h2>
                            <p className='text-muted-foreground text-sm'>Clinic management system connectivity</p>
                        </div>
                        <div className='flex items-center gap-3'>
                            <motion.div
                                animate={{
                                    scale: healthCheck ? [1, 1.2, 1] : 1,
                                    backgroundColor: healthCheck ? '#10B981' : '#EF4444'
                                }}
                                className='h-4 w-4 rounded-full'
                                transition={{
                                    repeat: healthCheck ? Number.POSITIVE_INFINITY : 0,
                                    duration: 2,
                                    ease: 'easeInOut'
                                }}
                            />
                            <span className={`font-medium text-sm ${healthCheck ? 'text-green-600' : 'text-red-600'}`}>
                                {healthCheck ? 'All Systems Operational' : 'System Offline'}
                            </span>
                        </div>
                    </div>

                    {/* Additional status info */}
                    <div className='grid grid-cols-2 gap-4 text-xs md:grid-cols-4'>
                        <div className='rounded-lg border border-green-200 bg-green-50 p-3 text-center'>
                            <div className='font-semibold text-green-700'>Database</div>
                            <div className='text-green-600'>Connected</div>
                        </div>
                        <div className='rounded-lg border border-green-200 bg-green-50 p-3 text-center'>
                            <div className='font-semibold text-green-700'>API</div>
                            <div className='text-green-600'>{healthCheck ? 'Live' : 'Offline'}</div>
                        </div>
                        <div className='rounded-lg border border-blue-200 bg-blue-50 p-3 text-center'>
                            <div className='font-semibold text-blue-700'>Security</div>
                            <div className='text-blue-600'>Active</div>
                        </div>
                        <div className='rounded-lg border border-blue-200 bg-blue-50 p-3 text-center'>
                            <div className='font-semibold text-blue-700'>Backup</div>
                            <div className='text-blue-600'>Enabled</div>
                        </div>
                    </div>
                </motion.section>

                {/* Features Section */}
                <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 20 }}
                    transition={{ delay: 0.9 }}
                >
                    <FeaturesSection />
                </motion.div>

                {/* Testimonials */}
                <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 20 }}
                    transition={{ delay: 1.1 }}
                >
                    <TestimonialsSection />
                </motion.div>

                {/* Final CTA */}
                <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 20 }}
                    transition={{ delay: 1.3 }}
                >
                    <FinalCTA />
                </motion.div>

                {/* Footer */}
                <motion.div
                    animate={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                    transition={{ delay: 1.5 }}
                >
                    <Footer />
                </motion.div>
            </div>
        </motion.div>
    );
};
