'use client';

import { motion } from 'framer-motion';
import { CalendarDaysIcon, CreditCardIcon, MessageSquareIcon, StethoscopeIcon } from 'lucide-react';
import { useId } from 'react';

const features = [
    {
        icon: <CalendarDaysIcon className='h-10 w-10 text-blue-500' />,
        title: 'Effortless Scheduling',
        description: 'Manage appointments, set reminders, and reduce no-shows with our intuitive scheduling tools.'
    },
    {
        icon: <StethoscopeIcon className='h-10 w-10 text-green-500' />,
        title: 'Comprehensive Patient Records',
        description:
            "Securely store and access a child's complete medical history, growth charts, and immunization records."
    },
    {
        icon: <CreditCardIcon className='h-10 w-10 text-purple-500' />,
        title: 'Simplified Billing & Payments',
        description: 'Automate billing cycles and process payments seamlessly, all in one place.'
    },
    {
        icon: <MessageSquareIcon className='h-10 w-10 text-orange-500' />,
        title: 'Secure Communication',
        description: 'Enable safe and private communication between doctors, staff, and parents.'
    }
];

export function FeaturesSection() {
    const featId = useId();
    return (
        <section
            className='bg-white py-20'
            id={featId}
        >
            <div className='container mx-auto max-w-7xl px-4 md:px-8'>
                <div className='text-center'>
                    <h2 className='font-bold text-3xl text-gray-900 tracking-tight sm:text-4xl'>
                        Features Designed for You
                    </h2>
                    <p className='mx-auto mt-4 max-w-3xl text-gray-600 text-lg'>
                        We’ve built a platform that understands the unique needs of a pediatric clinic. From tiny
                        patients to big administrative tasks, we’ve got you covered.
                    </p>
                </div>
                <div className='mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
                    {features.map((feature, idx) => (
                        <motion.div
                            className='flex flex-col items-center rounded-xl bg-gray-50 p-6 text-center shadow-lg transition-transform duration-200 hover:scale-105'
                            initial={{ opacity: 0, y: 20 }}
                            key={feature.title}
                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            whileInView={{ opacity: 1, y: 0 }}
                        >
                            <div className='mb-4 rounded-full bg-white p-4 shadow-md'>{feature.icon}</div>
                            <h3 className='font-semibold text-gray-900 text-xl'>{feature.title}</h3>
                            <p className='mt-2 text-gray-500 text-sm'>{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
