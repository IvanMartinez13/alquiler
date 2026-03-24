import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import PropertyForm from '@/pages/properties/partials/property-form';
import type { BreadcrumbItem } from '@/types';

type AmenityOption = {
    id: number;
    name: string;
    icon?: string | null;
};

type ExistingImage = {
    id: number;
    url: string;
    alt?: string | null;
    sort_order: number;
};

type PropertyPayload = {
    id: number;
    title: string;
    slug: string;
    description: string;
    address: string;
    city: string;
    country: string;
    latitude: number | null;
    longitude: number | null;
    type: string;
    max_guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
    check_in_time: string;
    check_out_time: string;
    notes?: string | null;
    status: string;
    amenity_ids: number[];
    images: ExistingImage[];
    house_rules?: {
        check_in?: string;
        check_out?: string;
        cancellation_policy?: string;
        damage_deposit?: string;
        children_policy?: string;
        age_restriction?: string;
        smoking_allowed?: boolean;
        pets_allowed?: boolean;
    };
};

type Props = {
    property: PropertyPayload;
    amenities: AmenityOption[];
};

export default function EditProperty({ property, amenities }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Properties', href: '/properties' },
        { title: property.title, href: `/properties/${property.slug}/edit` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${property.title}`} />

            <div className="mx-auto max-w-5xl space-y-6 p-4">
                <div>
                    <h1 className="text-2xl font-semibold">Edit property</h1>
                    <p className="text-sm text-muted-foreground">
                        Update listing details and media.
                    </p>
                </div>

                <PropertyForm
                    action={`/properties/${property.slug}`}
                    method="put"
                    submitLabel="Save changes"
                    property={property}
                    amenities={amenities}
                />
            </div>
        </AppLayout>
    );
}
