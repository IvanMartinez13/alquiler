import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Amenity = {
    id: number;
    name: string;
    icon?: string | null;
};

type Image = {
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
    type: string;
    max_guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
    check_in_time: string;
    check_out_time: string;
    notes?: string | null;
    status: string;
    house_rules?: Record<string, string | boolean | null>;
    amenities: Amenity[];
    images: Image[];
};

type Props = {
    property: PropertyPayload;
};

export default function ShowProperty({ property }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Properties', href: '/properties' },
        { title: property.title, href: `/properties/${property.slug}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={property.title} />

            <div className="mx-auto max-w-6xl space-y-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            {property.title}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {property.city}, {property.country} •{' '}
                            {property.type}
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={`/properties/${property.slug}/edit`}>
                            Edit
                        </Link>
                    </Button>
                </div>

                {property.images.length > 0 && (
                    <div className="grid gap-3 md:grid-cols-3">
                        {property.images.map((image) => (
                            <img
                                key={image.id}
                                src={image.url}
                                alt={image.alt ?? property.title}
                                className="h-48 w-full rounded-xl object-cover"
                            />
                        ))}
                    </div>
                )}

                <div className="grid gap-6 md:grid-cols-3">
                    <section className="space-y-2 rounded-xl border border-border p-4 md:col-span-2">
                        <h2 className="font-semibold">Description</h2>
                        <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                            {property.description}
                        </p>
                    </section>

                    <section className="space-y-2 rounded-xl border border-border p-4">
                        <h2 className="font-semibold">Capacity</h2>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                            <li>Guests: {property.max_guests}</li>
                            <li>Bedrooms: {property.bedrooms}</li>
                            <li>Beds: {property.beds}</li>
                            <li>Bathrooms: {property.bathrooms}</li>
                            <li>Check in: {property.check_in_time}</li>
                            <li>Check out: {property.check_out_time}</li>
                        </ul>
                    </section>
                </div>

                <section className="space-y-2 rounded-xl border border-border p-4">
                    <h2 className="font-semibold">Amenities</h2>
                    <div className="flex flex-wrap gap-2">
                        {property.amenities.map((amenity) => (
                            <span
                                key={amenity.id}
                                className="rounded-full bg-muted px-3 py-1 text-sm"
                            >
                                {amenity.icon ? `${amenity.icon} ` : ''}
                                {amenity.name}
                            </span>
                        ))}
                    </div>
                </section>

                {property.notes && (
                    <section className="space-y-2 rounded-xl border border-border p-4">
                        <h2 className="font-semibold">Notes</h2>
                        <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                            {property.notes}
                        </p>
                    </section>
                )}
            </div>
        </AppLayout>
    );
}
