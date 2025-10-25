import { cva } from 'class-variance-authority';

import { geistMono } from '@/styles/fonts';

type Level = 1 | 2 | 3 | 4 | 5 | 6;
const headingVariants = cva('scroll-m-20 text-balance text-pretty tracking-tight', {
    variants: {
        level: {
            1: `text-3xl md:text-3xl lg:text-4xl 2xl:text-5xl leading-12 md:leading-14 lg:leading-18 ${geistMono.className}`,
            2: 'font-semibold text-2xl md:text-3xl',
            3: 'font-semibold text-xl md:text-2xl',
            4: 'font-medium text-lg md:text-xl',
            5: 'font-medium text-base md:text-lg',
            6: 'text-sm md:text-base'
        },
        font: {
            default: geistMono.className,
            sans: 'font-sans'
        }
    }
});

export function Heading({
    children,
    className,
    level = 1,
    font = 'sans'
}: {
    children: React.ReactNode;
    className?: string;
    level?: Level;
    font?: 'default' | 'sans';
}) {
    const Tag = `h${level}` as const;
    return <Tag className={headingVariants({ level, className, font })}>{children}</Tag>;
}
