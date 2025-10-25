import Image from 'next/image';
import type React from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='flex h-screen w-full items-center justify-center'>
            <div className='flex h-full w-1/2 items-center justify-center'>{children}</div>
            <div className='relative hidden h-full w-1/2 md:flex'>
                <Image
                    alt='Doctors'
                    className='h-full w-full object-cover'
                    height={1000}
                    src='/clinic.webp'
                    width={1000}
                />
                <div className='absolute top-0 z-10 flex h-full w-full flex-col items-center justify-center bg-black bg-opacity-40'>
                    <h1 className='font-bold text-3xl text-white 2xl:text-5xl'>Kinda HMS</h1>
                    <p className='text-base text-blue-500'>You're welcome</p>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
