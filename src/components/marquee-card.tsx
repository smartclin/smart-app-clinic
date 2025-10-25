import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type MarqueeCardProps = {
    children: ReactNode;
    className?: string;
    pauseOnHover?: boolean;
};

export function MarqueeCard({ children, className, pauseOnHover = false }: MarqueeCardProps) {
    return (
        <div
            className={cn(
                'group flex gap-16 overflow-hidden [--gap:4rem]',
                pauseOnHover && '[&:hover>*]:pause',
                className
            )}
        >
            {/* Duplicate the children to create the infinite scroll effect */}
            <div className='flex min-w-full shrink-0 animate-marquee items-center justify-around gap-16'>
                {children}
            </div>
            <div
                aria-hidden
                className='flex min-w-full shrink-0 animate-marquee items-center justify-around gap-16'
            >
                {children}
            </div>
        </div>
    );
}
