import { Head } from '@inertiajs/react';
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
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Properties', href: '/properties' },
        { title: 'Create', href: '/properties/create' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create property" />

            <div className="mx-auto max-w-5xl space-y-6 p-4">
                <div>
                    <h1 className="text-2xl font-semibold">Create property</h1>
                    <p className="text-sm text-muted-foreground">
                        Add core details, amenities and images.
                    </p>
                </div>

                <PropertyForm
                    action="/properties"
                    method="post"
                    submitLabel="Create property"
                    amenities={amenities}
                />
            </div>
        </AppLayout>
    );
}
