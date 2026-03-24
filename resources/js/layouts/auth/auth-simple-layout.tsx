import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { useTranslations } from '@/hooks/use-translations';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { t } = useTranslations();

    return (
        <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background px-4 py-8 md:px-10">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-0 -left-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-chart-2/15 blur-3xl" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_65%)]" />
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="rounded-3xl border border-border/60 bg-card/80 p-7 shadow-xl shadow-black/[0.04] backdrop-blur-xl sm:p-8">
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col items-center gap-4 text-center">
                            <Link
                                href={home()}
                                className="group inline-flex items-center justify-center rounded-2xl border border-border/70 bg-background/80 p-3 transition-transform duration-300 hover:scale-[1.03]"
                            >
                                <AppLogoIcon className="size-8 fill-current text-foreground" />
                                <span className="sr-only">{title}</span>
                            </Link>

                            <div className="space-y-2">
                                <p className="text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                                    {t('layout.auth.secure_access')}
                                </p>
                                <h1 className="text-2xl font-semibold tracking-tight">
                                    {title}
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    {description}
                                </p>
                            </div>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
