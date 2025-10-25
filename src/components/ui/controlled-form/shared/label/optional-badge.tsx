import { cn } from '@/lib/utils';

type TOptionalBadge = {
    className?: string;
};

export default function OptionalBadge({ className }: Readonly<TOptionalBadge>) {
    return <span className={cn('mt-auto ml-auto text-muted-foreground text-xs', className)}>Optional</span>;
}
