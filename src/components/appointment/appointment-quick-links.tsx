import Link from 'next/link';

import { getSession } from '@/lib/auth-server';
import { cn } from '@/lib/utils'; // helper to merge classNames (shadcn style)

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

// Define quick link config
const quickLinks = [
    { label: 'Charts', href: '?cat=charts', color: 'bg-gray-100 text-gray-600' },
    { label: 'Appointments', href: '?cat=appointments', color: 'bg-violet-100 text-violet-600' },
    { label: 'Diagnosis', href: '?cat=diagnosis', color: 'bg-blue-100 text-blue-600' },
    { label: 'Bills', href: '?cat=billing', color: 'bg-green-100 text-green-600' },
    { label: 'Medical History', href: '?cat=medical-history', color: 'bg-red-100 text-red-600' },
    { label: 'Payments', href: '?cat=payments', color: 'bg-purple-100 text-purple-600' },
    { label: 'Lab Test', href: '?cat=lab-test', color: 'bg-yellow-100 text-yellow-600' },
    { label: 'Vital Signs', href: '?cat=appointments#vital-signs', color: 'bg-pink-100 text-pink-600' }
];

const AppointmentQuickLinks = async () => {
    const session = await getSession();

    // (Optional) filter based on role
    const isAdmin = session?.user?.role === 'admin';

    return (
        <Card className='w-full rounded-xl bg-white shadow-sm'>
            <CardHeader>
                <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-wrap gap-2'>
                {quickLinks
                    .filter(link => (isAdmin ? true : link.label !== 'Bills')) // Example: hide bills unless admin
                    .map(link => (
                        <Link
                            aria-label={`Go to ${link.label}`}
                            className={cn('rounded-lg px-4 py-2 transition-colors hover:opacity-80', link.color)}
                            href={link.href}
                            key={link.href}
                        >
                            {link.label}
                        </Link>
                    ))}
            </CardContent>
        </Card>
    );
};

export default AppointmentQuickLinks;
