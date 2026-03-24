import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type PropertyCard = {
    id: number;
    title: string;
    slug: string;
    city: string;
    country: string;
    type: string;
    status: string;
    max_guests: number;
    cover_image_url?: string | null;
    amenities_count: number;
};

type Props = {
    properties: {
        data: PropertyCard[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
};

export default function PropertiesIndex({ properties }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Properties',
            href: '/properties',
        },
    ];

    function destroyProperty(slug: string) {
        if (!window.confirm('Delete this property?')) {
            return;
        }

        router.delete(`/properties/${slug}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Properties" />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            My properties
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage listings, amenities and media.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/properties/create">New property</Link>
                    </Button>
                </div>

                {properties.data.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                        No properties yet. Create your first listing.
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {properties.data.map((property) => (
                            <article
                                key={property.id}
                                className="overflow-hidden rounded-xl border border-border"
                            >
                                {property.cover_image_url ? (
                                    <img
                                        src={property.cover_image_url}
                                        alt={property.title}
                                        className="h-44 w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-44 items-center justify-center bg-muted text-sm text-muted-foreground">
                                        No image
                                    </div>
                                )}

                                <div className="space-y-2 p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <h2 className="line-clamp-2 font-semibold">
                                            {property.title}
                                        </h2>
                                        <span className="rounded-full bg-muted px-2 py-1 text-xs capitalize">
                                            {property.status}
                                        </span>
                                    </div>

                                    <p className="text-sm text-muted-foreground">
                                        {property.city}, {property.country} •{' '}
                                        {property.type}
                                    </p>

                                    <p className="text-sm text-muted-foreground">
                                        Guests: {property.max_guests} •
                                        Amenities: {property.amenities_count}
                                    </p>

                                    <div className="flex gap-2 pt-2">
                                        <Button variant="outline" asChild>
                                            <Link
                                                href={`/properties/${property.slug}`}
                                            >
                                                View
                                            </Link>
                                        </Button>
                                        <Button variant="outline" asChild>
                                            <Link
                                                href={`/properties/${property.slug}/edit`}
                                            >
                                                Edit
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            onClick={() =>
                                                destroyProperty(property.slug)
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                <div className="flex flex-wrap gap-2">
                    {properties.links.map((link, index) => (
                        <Button
                            key={`${link.label}-${index}`}
                            variant={link.active ? 'default' : 'outline'}
                            disabled={!link.url}
                            asChild={Boolean(link.url)}
                        >
                            {link.url ? (
                                <Link href={link.url}>{link.label}</Link>
                            ) : (
                                <span>{link.label}</span>
                            )}
                        </Button>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
