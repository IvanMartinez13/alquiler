import { Head, Link, router } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Social accounts',
        href: '/settings/social-accounts',
    },
];

export default function SocialAccounts({ providers, status }: Props) {
    const unlinkProvider = (provider: SocialProvider['key']) => {
        router.delete(`/settings/social-accounts/${provider}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Social accounts" />

            <h1 className="sr-only">Social accounts</h1>

            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="Social login providers"
                        description="Link or unlink Google, Facebook, and Apple accounts for faster sign in"
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
                                    <p className="font-medium">{provider.label}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {provider.connected
                                            ? `Conectada${provider.connected_email ? ` como ${provider.connected_email}` : ''}`
                                            : 'No conectada'}
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
                                        Desvincular
                                    </Button>
                                ) : (
                                    <Button asChild>
                                        <Link
                                            href={`/settings/social-accounts/${provider.key}/redirect`}
                                        >
                                            Vincular
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
