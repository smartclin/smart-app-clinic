import {
    SiAuthelia,
    SiDrizzle,
    SiNextdotjs,
    SiReact,
    SiShadcnui,
    SiTailwindcss,
    SiTrpc,
    SiTypescript,
    SiVercel
} from 'react-icons/si';

import { cn } from '@/lib/utils';

import { MarqueeCard } from './marquee-card';

const technologies = [
    {
        icon: SiReact,
        name: 'React'
    },
    {
        icon: SiNextdotjs,
        name: 'Next.js'
    },
    {
        icon: SiTailwindcss,
        name: 'Tailwind CSS'
    },
    {
        icon: SiDrizzle,
        name: 'Drizzle ORM'
    },
    {
        icon: SiTrpc,
        name: 'tRPC'
    },
    {
        icon: SiTypescript,
        name: 'TypeScript'
    },
    {
        icon: SiShadcnui,
        name: 'Shadcn UI'
    },
    {
        icon: SiAuthelia,
        name: 'Better Auth'
    },
    {
        icon: SiVercel,
        name: 'Vercel'
    }
];

type Props = {
    bgColor?: string;
};

const TechMarquee = ({ bgColor }: Props) => {
    return (
        <div className='flex items-center gap-12 rounded-xl py-8'>
            <div className='relative flex-1 overflow-hidden'>
                <MarqueeCard
                    className='[--duration:30s]'
                    pauseOnHover
                >
                    {technologies.map(tech => (
                        <div
                            className='flex items-center gap-4'
                            key={tech.name}
                        >
                            <tech.icon className='size-8' />
                            <span className='select-none'>{tech.name}</span>
                        </div>
                    ))}
                </MarqueeCard>

                <div
                    className={cn(
                        'pointer-events-none absolute inset-y-0 left-0 w-20 bg-linear-to-r',
                        bgColor && `from-${bgColor}`
                    )}
                />
                <div
                    className={cn(
                        'pointer-events-none absolute inset-y-0 right-0 w-20 bg-linear-to-l',
                        bgColor && `from-${bgColor}`
                    )}
                />
            </div>
        </div>
    );
};

export default TechMarquee;
