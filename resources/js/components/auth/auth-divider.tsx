import { cn } from '@/lib/utils';

type Props = {
    label: string;
    className?: string;
};

export default function AuthDivider({ label, className }: Props) {
    return (
        <div className={cn('relative text-center text-[11px] uppercase tracking-[0.16em] text-muted-foreground', className)}>
            <span className="bg-background/90 px-3">{label}</span>
            <div className="absolute inset-x-0 top-1/2 -z-10 border-t border-border/80" />
        </div>
    );
}
