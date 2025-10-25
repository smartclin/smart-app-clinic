'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

function Year() {
    const [year, setYear] = useState<number | null>(null);

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        setYear(currentYear);
    }, []);

    if (year === null) {
        return <>{'2025'}</>; // Fallback year
    }

    return <>{year}</>;
}

export default function Footer() {
    return (
        <footer className='flex h-10 w-full items-center justify-center border-border border-t text-sm'>
            &copy; <Year /> &nbsp;
            <Link
                className='text-primary'
                href='http://smart-clinic.app'
            >
                [Smart Clinic App]
            </Link>
            &nbsp; All rights reserved.
        </footer>
    );
}
