import { Head, Link, router } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/use-translations';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import type { BreadcrumbItem } from '@/types';

type SocialProvider = {
    key: 'google' | 'facebook';
    label: string;
    connected: boolean;
    connected_email?: string | null;
    avatar?: string | null;
};

type Props = {
    providers: SocialProvider[];
    status?: string;
};

export default function SocialAccounts({ providers, status }: Props) {
    const { t } = useTranslations();
    const unlinkProvider = (provider: SocialProvider['key']) => {
        router.delete(`/settings/social-accounts/${provider}`);
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('settings.social_accounts.breadcrumb'),
            href: '/settings/social-accounts',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('settings.social_accounts.head_title')} />

            <h1 className="sr-only">
                {t('settings.social_accounts.head_title')}
            </h1>

            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title={t('settings.social_accounts.heading_title')}
                        description={t(
                            'settings.social_accounts.heading_description',
                        )}
                    />

                    {status && (
                        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                            {status}
                        </div>
                    )}

                    <div className="space-y-4">
                        {providers.map((provider) => (
                            <div
                                key={provider.key}
                                className="flex items-center justify-between gap-4 rounded-lg border p-4"
                            >
                                <div className="min-w-0">
                                    <p className="font-medium">
                                        {provider.label}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {provider.connected
                                            ? `${t('settings.social_accounts.connected')}${provider.connected_email ? ` ${t('settings.social_accounts.connected_as').replace(':email', provider.connected_email)}` : ''}`
                                            : t(
                                                  'settings.social_accounts.not_connected',
                                              )}
                                    </p>
                                </div>

                                {provider.connected ? (
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() =>
                                            unlinkProvider(provider.key)
                                        }
                                    >
                                        {t('settings.social_accounts.unlink')}
                                    </Button>
                                ) : (
                                    <Button asChild>
                                        <Link
                                            href={`/settings/social-accounts/${provider.key}/redirect`}
                                        >
                                            {t('settings.social_accounts.link')}
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
