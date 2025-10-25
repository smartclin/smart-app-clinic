// components/home/TestimonialsSection.tsx
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useId } from 'react';

const testimonials = [
    {
        quote: 'Our clinic has never run more smoothly. The scheduling feature alone has saved us countless hours every week!',
        name: 'Dr. Evelyn Reed',
        title: 'Pediatrician, Bright Smiles Clinic',
        image: 'https://placehold.co/100x100/AEC6CF/ffffff?text=ER'
    },
    {
        quote: 'The patient record system is incredibly organized and easy to use. I can access everything I need in seconds.',
        name: 'Sarah Chen',
        title: 'Clinic Manager, Little Angels Pediatrics',
        image: 'https://placehold.co/100x100/D4B8E1/ffffff?text=SC'
    },
    {
        quote: "The billing features are a game-changer. We've seen a significant reduction in administrative errors and time spent on invoices.",
        name: 'Mark Davis',
        title: "Administrator, Children's Health Center",
        image: 'https://placehold.co/100x100/F2D2BD/ffffff?text=MD'
    }
];

export function TestimonialsSection() {
    const testId = useId();
    return (
        <section
            className='bg-gray-100 py-20'
            id={testId}
        >
            <div className='container mx-auto max-w-7xl px-4 md:px-8'>
                <div className='text-center'>
                    <h2 className='font-bold text-3xl text-gray-900 tracking-tight sm:text-4xl'>What Our Users Say</h2>
                    <p className='mx-auto mt-4 max-w-3xl text-gray-600 text-lg'>
                        Trusted by pediatric clinics of all sizes, our app helps practices grow and thrive.
                    </p>
                </div>
                <div className='mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
                    {testimonials.map((tst, idx) => (
                        <motion.article
                            className='rounded-xl bg-white p-6 shadow-lg'
                            initial={{ opacity: 0, y: 20 }}
                            key={tst.title}
                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            whileInView={{ opacity: 1, y: 0 }}
                        >
                            <p className='text-gray-600 italic'>"{tst.quote}"</p>
                            <div className='mt-6 flex items-center'>
                                <Image
                                    alt={tst.name}
                                    className='h-12 w-12 rounded-full border-2 border-white object-cover shadow'
                                    height={48}
                                    loading='lazy'
                                    src={tst.image || '/image.webp'}
                                    width={48}
                                />
                                <div className='ml-4'>
                                    <p className='font-semibold text-gray-900'>{tst.name}</p>
                                    <p className='text-gray-500 text-sm'>{tst.title}</p>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
