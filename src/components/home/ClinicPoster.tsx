'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export function ClinicPoster() {
    return (
        <motion.div
            className='overflow-hidden rounded-2xl border bg-card shadow-lg'
            initial={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
        >
            <Image
                alt='Smart Clinic Poster'
                className='h-auto w-full object-cover'
                height={1365}
                priority
                src='/clinic.webp'
                width={1024}
            />
        </motion.div>
    );
}
