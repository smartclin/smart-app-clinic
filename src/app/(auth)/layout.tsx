import Image from 'next/image';
import type React from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='flex h-screen w-full items-center justify-center'>
            {/* Centered content section */}
            <div className='flex h-full w-full max-w-screen-sm items-center justify-center p-6 md:w-1/2'>
                {children}
            </div>

            {/* Background Image Section (Only shown on md+ screens) */}
            <div className='relative hidden h-full w-1/2 md:flex'>
                <Image
                    alt='Doctors'
                    className='h-full w-full object-cover transition-opacity duration-500 ease-in-out'
                    height={1000}
                    priority
                    src='/auth.webp'
                    width={1000}
                />
                <div className='absolute top-0 z-10 flex h-full w-full flex-col items-center justify-center bg-black bg-opacity-40'>
                    <h1 className='font-bold text-3xl text-white 2xl:text-5xl'>Smart Clinic</h1>
                    <p className='text-base text-blue-500'>You're welcome</p>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
