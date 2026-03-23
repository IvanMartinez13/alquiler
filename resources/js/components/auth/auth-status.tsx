import { cn } from '@/lib/utils';

type Variant = 'success' | 'info';

type Props = {
    children: React.ReactNode;
    variant?: Variant;
    className?: string;
};

const variantClasses: Record<Variant, string> = {
    success: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    info: 'border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-300',
};

export default function AuthStatus({ children, variant = 'success', className }: Props) {
    return (
        <div className={cn('rounded-xl border px-4 py-3 text-sm leading-relaxed', variantClasses[variant], className)}>
            {children}
        </div>
    );
}
