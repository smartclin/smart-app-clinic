'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { APP_ROUTES } from '@/constants/app-routes';

interface BreadcrumbSegment {
    label: string;
    href?: string;
    params?: Record<string, string>;
    isActive?: boolean;
    className?: string;
}

export function BreadcrumbSegments() {
    const pathname = usePathname();

    const pathSegments = pathname.split('/').filter(segment => segment);

    const buildSegments = () => {
        const segments: BreadcrumbSegment[] = [
            {
                label: 'Dashboard',
                href: APP_ROUTES.DASHBOARD.ROOT,
                isActive: pathSegments.length === 0,
                className: 'hidden md:block'
            }
        ];

        const appRoutes = Object.values(APP_ROUTES).flatMap(route => {
            if (typeof route === 'object' && route !== null) {
                return Object.values(route).filter(subRoute => typeof subRoute === 'string');
            }

            return [];
        });

        pathSegments.forEach((segment, index) => {
            const href = `/${pathSegments.slice(0, index + 1).join('/')}`;

            if (appRoutes.includes(href)) {
                segments.push({
                    label: segment.charAt(0).toUpperCase() + segment.slice(1),
                    href,
                    isActive: index === pathSegments.length - 1
                });
            }
        });

        return segments;
    };

    const segments = buildSegments().filter(
        (segment, index, self) => index === self.findIndex(s => s.href === segment.href)
    );

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {segments.map((segment, index) => {
                    const isLast = index === segments.length - 1;

                    return (
                        <Fragment key={segment.label}>
                            <BreadcrumbItem>
                                {segment.href && !isLast ? (
                                    <BreadcrumbLink asChild>
                                        <Link href={segment.href}>{segment.label}</Link>
                                    </BreadcrumbLink>
                                ) : (
                                    <BreadcrumbPage>{segment.label}</BreadcrumbPage>
                                )}
                            </BreadcrumbItem>
                            {!isLast && <BreadcrumbSeparator className='hidden md:inline' />}
                        </Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
