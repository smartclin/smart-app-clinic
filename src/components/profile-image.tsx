import Image from 'next/image';

import { cn } from '@/lib/utils';
import { getInitials } from '@/utils';

export const ProfileImage = ({
    url,
    name,
    className,
    textClassName,
    bgColor
}: {
    url?: string;
    name?: string; // make optional to avoid TS warning
    className?: string;
    textClassName?: string;
    bgColor?: string;
}) => {
    // 1️⃣ Use image if URL is provided
    if (url) {
        return (
            <Image
                alt={name ?? 'Profile'}
                className={cn('flex h-10 w-10 rounded-full object-cover md:hidden lg:block', className)}
                height={40}
                src={url}
                width={40}
            />
        );
    }

    // 2️⃣ Use initials if name is provided
    if (name) {
        return (
            <div
                className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full font-light text-base text-white md:hidden lg:flex',
                    className
                )}
                style={{ backgroundColor: bgColor ?? '#2563eb' }}
            >
                <p className={textClassName}>{getInitials(name)}</p>
            </div>
        );
    }

    // 3️⃣ Fallback if neither URL nor name is provided
    return (
        <div
            className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 font-light text-base text-white',
                className
            )}
        />
    );
};
