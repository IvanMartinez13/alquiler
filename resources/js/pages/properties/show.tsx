import { Head, Link } from '@inertiajs/react';
import {
    Bath,
    BedDouble,
    Building2,
    ChevronLeft,
    ChevronRight,
    Clock3,
    MapPin,
    Users,
    VenetianMask,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { useTranslations } from '@/hooks/use-translations';
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
    latitude?: number | null;
    longitude?: number | null;
    type: string;
    max_guests: number;
    bedrooms: number;
    beds: number;
    single_beds: number;
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
    const { t } = useTranslations();
    const [itemsPerView, setItemsPerView] = useState(3);
    const [sliderPage, setSliderPage] = useState(0);
    const [galleryIndex, setGalleryIndex] = useState<number | null>(null);

    useEffect(() => {
        function syncViewportRules() {
            setItemsPerView(window.innerWidth < 768 ? 1 : 3);
        }

        syncViewportRules();
        window.addEventListener('resize', syncViewportRules);

        return () => window.removeEventListener('resize', syncViewportRules);
    }, []);

    useEffect(() => {
        setSliderPage(0);
    }, [itemsPerView, property.images.length]);

    useEffect(() => {
        if (galleryIndex === null) {
            return;
        }

        function onKeydown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setGalleryIndex(null);

                return;
            }

            if (event.key === 'ArrowRight') {
                setGalleryIndex((previous) => {
                    if (previous === null) {
                        return previous;
                    }

                    return (previous + 1) % property.images.length;
                });
            }

            if (event.key === 'ArrowLeft') {
                setGalleryIndex((previous) => {
                    if (previous === null) {
                        return previous;
                    }

                    return (previous - 1 + property.images.length) % property.images.length;
                });
            }
        }

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKeydown);

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', onKeydown);
        };
    }, [galleryIndex, property.images.length]);

    const imagePages = useMemo(() => {
        if (property.images.length === 0) {
            return [] as Image[][];
        }

        const pages: Image[][] = [];

        for (let i = 0; i < property.images.length; i += itemsPerView) {
            pages.push(property.images.slice(i, i + itemsPerView));
        }

        return pages;
    }, [property.images, itemsPerView]);

    const safeSliderPage = Math.min(sliderPage, Math.max(0, imagePages.length - 1));
    const visibleImages = imagePages[safeSliderPage] ?? [];
    const canGoPrev = safeSliderPage > 0;
    const canGoNext = safeSliderPage < imagePages.length - 1;

    const houseRules = property.house_rules ?? {};
    const mapQuery =
        property.latitude !== null &&
        property.latitude !== undefined &&
        property.longitude !== null &&
        property.longitude !== undefined
            ? `${property.latitude},${property.longitude}`
            : `${property.address}, ${property.city}, ${property.country}`;
    const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=15&output=embed`;
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapQuery)}`;

    const ruleRows = [
        {
            key: 'check_in',
            label: t('properties.form.rule_check_in', 'Check-in rule'),
            value: asString(houseRules.check_in),
            html: false,
        },
        {
            key: 'check_out',
            label: t('properties.form.rule_check_out', 'Check-out rule'),
            value: asString(houseRules.check_out),
            html: false,
        },
        {
            key: 'cancellation_policy',
            label: t('properties.form.rule_cancellation', 'Cancellation policy'),
            value: asString(houseRules.cancellation_policy),
            html: true,
        },
        {
            key: 'damage_deposit',
            label: t('properties.form.rule_damage_deposit', 'Damage deposit'),
            value: asString(houseRules.damage_deposit),
            html: false,
        },
        {
            key: 'age_restriction',
            label: t('properties.form.rule_age_restriction', 'Age restriction'),
            value: asString(houseRules.age_restriction),
            html: false,
        },
    ].filter((row) => row.value.trim() !== '');

    const booleanRules = [
        {
            key: 'free_cancellation',
            label: t('properties.form.free_cancellation', 'Free cancellation'),
            value: asBoolean(houseRules.free_cancellation),
        },
        {
            key: 'smoking_allowed',
            label: t('properties.form.smoking_allowed', 'Smoking allowed'),
            value: asBoolean(houseRules.smoking_allowed),
        },
        {
            key: 'pets_allowed',
            label: t('properties.form.pets_allowed', 'Pets allowed'),
            value: asBoolean(houseRules.pets_allowed),
        },
    ];

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('layout.sidebar.properties', 'Properties'),
            href: '/properties',
        },
        { title: property.title, href: `/properties/${property.slug}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={property.title} />

            <div className="mx-auto max-w-7xl space-y-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="mb-1 text-xs font-semibold tracking-widest text-primary uppercase">
                            {t(`properties.form.statuses.${property.status}`, property.status)}
                        </p>
                        <h1 className="text-2xl font-semibold md:text-3xl">
                            {property.title}
                        </h1>
                        <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                            <MapPin className="size-4" />
                            {property.address} - {property.city}, {property.country}
                        </p>
                    </div>
                    <Button className="shadow-sm" asChild>
                        <Link href={`/properties/${property.slug}/edit`}>
                            {t('properties.index.edit_action', 'Edit')}
                        </Link>
                    </Button>
                </div>

                {property.images.length > 0 && (
                    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">
                                {t('properties.form.images', 'Images')}
                            </h2>
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="outline"
                                    disabled={!canGoPrev}
                                    onClick={() => setSliderPage((previous) => previous - 1)}
                                >
                                    <ChevronLeft className="size-4" />
                                </Button>
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="outline"
                                    disabled={!canGoNext}
                                    onClick={() => setSliderPage((previous) => previous + 1)}
                                >
                                    <ChevronRight className="size-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="grid gap-3 md:grid-cols-3">
                            {visibleImages.map((image) => {
                                const absoluteIndex = property.images.findIndex(
                                    (item) => item.id === image.id,
                                );

                                return (
                                    <button
                                        key={image.id}
                                        type="button"
                                        className="group relative overflow-hidden rounded-xl"
                                        onClick={() => setGalleryIndex(absoluteIndex)}
                                    >
                                        <img
                                            src={image.url}
                                            alt={image.alt ?? property.title}
                                            className="h-56 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                                        />
                                        <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/55 to-transparent p-3 text-left text-xs text-white">
                                            {image.alt ?? property.title}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        <p className="mt-3 text-xs text-muted-foreground">
                            {safeSliderPage + 1} / {Math.max(imagePages.length, 1)}
                        </p>
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="space-y-6">
                        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                            <h2 className="mb-3 text-lg font-semibold">
                                {t('properties.form.description', 'Description')}
                            </h2>
                            <div
                                className="prose prose-sm max-w-none text-muted-foreground dark:prose-invert"
                                dangerouslySetInnerHTML={{ __html: property.description }}
                            />
                        </section>

                        {property.notes && (
                            <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                                <h2 className="mb-3 text-lg font-semibold">
                                    {t('properties.form.notes', 'Notes')}
                                </h2>
                                <div
                                    className="prose prose-sm max-w-none text-muted-foreground dark:prose-invert"
                                    dangerouslySetInnerHTML={{ __html: property.notes }}
                                />
                            </section>
                        )}

                        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                            <h2 className="mb-3 text-lg font-semibold">
                                {t('properties.form.amenities', 'Amenities')}
                            </h2>
                            <div className="flex flex-wrap gap-2.5">
                                {property.amenities.map((amenity) => (
                                    <span
                                        key={amenity.id}
                                        className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1.5 text-sm"
                                    >
                                        {amenity.icon ? (
                                            <i
                                                className={sanitizeIconClass(amenity.icon)}
                                                aria-hidden="true"
                                            />
                                        ) : null}
                                        <span>{amenity.name}</span>
                                    </span>
                                ))}
                            </div>
                        </section>

                        {(ruleRows.length > 0 || booleanRules.length > 0) && (
                            <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                                <h2 className="mb-3 text-lg font-semibold">
                                    {t('properties.form.sections.rules', 'Rules and notes')}
                                </h2>
                                <div className="space-y-4">
                                    {ruleRows.map((row) => (
                                        <div key={row.key} className="rounded-lg border border-border/70 p-3">
                                            <p className="mb-1 text-sm font-medium">{row.label}</p>
                                            {row.html ? (
                                                <div
                                                    className="prose prose-sm max-w-none text-muted-foreground dark:prose-invert"
                                                    dangerouslySetInnerHTML={{ __html: row.value }}
                                                />
                                            ) : (
                                                <p className="text-sm text-muted-foreground">
                                                    {row.value}
                                                </p>
                                            )}
                                        </div>
                                    ))}

                                    <div className="grid gap-2 sm:grid-cols-3">
                                        {booleanRules.map((rule) => (
                                            <div
                                                key={rule.key}
                                                className="rounded-lg border border-border/70 px-3 py-2 text-sm"
                                            >
                                                <p className="font-medium">{rule.label}</p>
                                                <p className="text-muted-foreground">
                                                    {rule.value
                                                        ? t('common.yes', 'Yes')
                                                        : t('common.no', 'No')}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>

                    <aside className="space-y-4 lg:sticky lg:top-20 lg:h-fit">
                        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                            <h2 className="mb-3 text-lg font-semibold">
                                {t('properties.show.overview', 'Overview')}
                            </h2>
                            <ul className="divide-y divide-border/70 rounded-lg border border-border/70 text-sm">
                                <li className="flex items-center justify-between gap-3 p-3">
                                    <span className="inline-flex items-center gap-2 text-muted-foreground">
                                        <Users className="size-4" />
                                        {t('properties.form.max_guests', 'Max guests')}
                                    </span>
                                    <span className="font-medium">{property.max_guests}</span>
                                </li>
                                <li className="flex items-center justify-between gap-3 p-3">
                                    <span className="inline-flex items-center gap-2 text-muted-foreground">
                                        <Building2 className="size-4" />
                                        {t('properties.form.bedrooms', 'Bedrooms')}
                                    </span>
                                    <span className="font-medium">{property.bedrooms}</span>
                                </li>
                                <li className="flex items-center justify-between gap-3 p-3">
                                    <span className="inline-flex items-center gap-2 text-muted-foreground">
                                        <BedDouble className="size-4" />
                                        {t('properties.form.double_beds', 'Double beds')}
                                    </span>
                                    <span className="font-medium">{property.beds}</span>
                                </li>
                                <li className="flex items-center justify-between gap-3 p-3">
                                    <span className="inline-flex items-center gap-2 text-muted-foreground">
                                        <VenetianMask className="size-4" />
                                        {t('properties.form.single_beds', 'Single beds')}
                                    </span>
                                    <span className="font-medium">{property.single_beds}</span>
                                </li>
                                <li className="flex items-center justify-between gap-3 p-3">
                                    <span className="inline-flex items-center gap-2 text-muted-foreground">
                                        <Bath className="size-4" />
                                        {t('properties.form.bathrooms', 'Bathrooms')}
                                    </span>
                                    <span className="font-medium">{property.bathrooms}</span>
                                </li>
                                <li className="flex items-center justify-between gap-3 p-3">
                                    <span className="inline-flex items-center gap-2 text-muted-foreground">
                                        <Clock3 className="size-4" />
                                        {t('properties.form.check_in', 'Check in')}
                                    </span>
                                    <span className="font-medium">{property.check_in_time}</span>
                                </li>
                                <li className="flex items-center justify-between gap-3 p-3">
                                    <span className="inline-flex items-center gap-2 text-muted-foreground">
                                        <Clock3 className="size-4" />
                                        {t('properties.form.check_out', 'Check out')}
                                    </span>
                                    <span className="font-medium">{property.check_out_time}</span>
                                </li>
                            </ul>
                        </section>

                        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                            <h2 className="mb-3 text-lg font-semibold">
                                {t('properties.show.location', 'Location')}
                            </h2>
                            <p className="text-sm text-muted-foreground">{property.address}</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {property.city}, {property.country}
                            </p>

                            <div className="mt-4 overflow-hidden rounded-xl border border-border/70">
                                <iframe
                                    title={t('properties.show.map_title', 'Property location on map')}
                                    src={mapEmbedUrl}
                                    className="h-56 w-full"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>

                            <Button className="mt-3 w-full" asChild>
                                <a href={directionsUrl} target="_blank" rel="noreferrer noopener">
                                    {t('properties.show.directions_action', 'Get directions')}
                                </a>
                            </Button>
                        </section>
                    </aside>
                </div>

                {galleryIndex !== null && property.images[galleryIndex] && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
                        onClick={() => setGalleryIndex(null)}
                    >
                        <button
                            type="button"
                            className="absolute top-4 right-4 rounded-full border border-white/25 bg-black/40 p-2 text-white"
                            onClick={() => setGalleryIndex(null)}
                        >
                            <X className="size-5" />
                        </button>

                        <button
                            type="button"
                            className="absolute left-3 rounded-full border border-white/25 bg-black/40 p-2 text-white md:left-6"
                            onClick={(event) => {
                                event.stopPropagation();
                                setGalleryIndex(
                                    (galleryIndex - 1 + property.images.length) % property.images.length,
                                );
                            }}
                        >
                            <ChevronLeft className="size-5" />
                        </button>

                        <img
                            src={property.images[galleryIndex].url}
                            alt={property.images[galleryIndex].alt ?? property.title}
                            className="max-h-[85vh] w-auto max-w-[92vw] rounded-xl object-contain"
                            onClick={(event) => event.stopPropagation()}
                        />

                        <button
                            type="button"
                            className="absolute right-3 rounded-full border border-white/25 bg-black/40 p-2 text-white md:right-6"
                            onClick={(event) => {
                                event.stopPropagation();
                                setGalleryIndex((galleryIndex + 1) % property.images.length);
                            }}
                        >
                            <ChevronRight className="size-5" />
                        </button>

                        <p className="absolute bottom-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs text-white">
                            {galleryIndex + 1} / {property.images.length}
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

function asString(value: string | boolean | null | undefined): string {
    if (typeof value === 'string') {
        return value;
    }

    return '';
}

function asBoolean(value: string | boolean | null | undefined): boolean {
    if (typeof value === 'boolean') {
        return value;
    }

    if (typeof value === 'string') {
        return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase().trim());
    }

    return false;
}

function sanitizeIconClass(icon: string | null | undefined): string {
    if (!icon) {
        return '';
    }

    return icon
        .split(/\s+/)
        .filter((token) => /^(fa[srlbd]|fa-[a-z0-9-]+)$/i.test(token.trim()))
        .join(' ');
}
