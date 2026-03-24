import { Head } from '@inertiajs/react';
import { useTranslations } from '@/hooks/use-translations';
import AppLayout from '@/layouts/app-layout';
import PropertyForm from '@/pages/properties/partials/property-form';
import type { BreadcrumbItem } from '@/types';

type AmenityOption = {
    id: number;
    name: string;
    icon?: string | null;
};

type Props = {
    amenities: AmenityOption[];
};

export default function CreateProperty({ amenities }: Props) {
    const { t } = useTranslations();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('layout.sidebar.properties', 'Properties'), href: '/properties' },
        { title: t('properties.form.create', 'Create'), href: '/properties/create' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('properties.form.create_property', 'Create property')} />

            <div className="mx-auto max-w-5xl space-y-6 p-4">
                <div>
                    <h1 className="text-2xl font-semibold">
                        {t('properties.form.create_property', 'Create property')}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {t(
                            'properties.form.create_description',
                            'Complete the form step by step to publish your property.',
                        )}
                    </p>
                </div>

                <PropertyForm
                    action="/properties"
                    method="post"
                    submitLabel={
                        t('properties.form.create_property', 'Create property')
                    }
                    amenities={amenities}
                />
            </div>
        </AppLayout>
    );
}
