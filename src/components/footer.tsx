import Link from 'next/link';

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className='flex h-10 w-full items-center justify-center border-border border-t text-sm'>
            &copy; {year} &nbsp;
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
