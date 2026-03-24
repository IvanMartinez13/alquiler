import { Head, Link, router } from '@inertiajs/react';
import {
    Bath,
    BedDouble,
    Building2,
    Search,
    ShieldCheck,
    SlidersHorizontal,
    Users,
    VenetianMask,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import SpotlightCard from '@/components/SpotlightCard';
import { Button } from '@/components/ui/button';
import ChoicesSelect from '@/components/ui/choices-select';
import type {ChoiceOption} from '@/components/ui/choices-select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { useTranslations } from '@/hooks/use-translations';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type PropertyCard = {
    id: number;
    title: string;
    slug: string;
    description: string;
    address: string;
    city: string;
    country: string;
    type: string;
    status: string;
    max_guests: number;
    bedrooms: number;
    beds: number;
    single_beds: number;
    bathrooms: number;
    check_in_time: string;
    check_out_time: string;
    free_cancellation: boolean;
    favorite_image_url?: string | null;
    favorite_image_alt?: string | null;
    amenity_ids: number[];
    amenities: string[];
    amenities_count: number;
};

type AmenityOption = {
    id: number;
    name: string;
    icon?: string | null;
};

type Props = {
    properties: PropertyCard[];
    amenities: AmenityOption[];
};

const PAGE_SIZE = 9;

export default function PropertiesIndex({ properties, amenities }: Props) {
    const { t } = useTranslations();
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [cityFilter, setCityFilter] = useState('all');
    const [countryFilter, setCountryFilter] = useState('all');
    const [maxGuestsFilter, setMaxGuestsFilter] = useState('');
    const [bedroomsFilter, setBedroomsFilter] = useState('');
    const [doubleBedsFilter, setDoubleBedsFilter] = useState('');
    const [singleBedsFilter, setSingleBedsFilter] = useState('');
    const [bathroomsFilter, setBathroomsFilter] = useState('');
    const [freeCancellationFilter, setFreeCancellationFilter] =
        useState(false);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [revealedCards, setRevealedCards] = useState<Record<number, boolean>>(
        {},
    );
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const cardsScrollRef = useRef<HTMLDivElement | null>(null);
    const revealObserverRef = useRef<IntersectionObserver | null>(null);
    const pendingElementsRef = useRef<HTMLElement[]>([]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('layout.sidebar.properties', 'Properties'),
            href: '/properties',
        },
    ];

    const typeOptions = useMemo<ChoiceOption[]>(
        () => [
            { value: 'all', label: t('properties.index.all', 'All') },
            ...Array.from(new Set(properties.map((item) => item.type))).map((option) => ({
                value: option,
                label: t(`properties.form.types.${option}`, option),
            })),
        ],
        [properties, t],
    );

    const statusOptions = useMemo<ChoiceOption[]>(
        () => [
            { value: 'all', label: t('properties.index.all', 'All') },
            ...Array.from(new Set(properties.map((item) => item.status))).map((option) => ({
                value: option,
                label: t(`properties.form.statuses.${option}`, option),
            })),
        ],
        [properties, t],
    );

    const countryOptions = useMemo<ChoiceOption[]>(() => {
        return [
            { value: 'all', label: t('properties.index.all', 'All') },
            ...Array.from(new Set(properties.map((item) => item.country)))
                .sort((a, b) => a.localeCompare(b))
                .map((country) => ({ value: country, label: country })),
        ];
    }, [properties, t]);

    const cityOptions = useMemo<ChoiceOption[]>(() => {
        const list = properties
            .filter((item) => countryFilter === 'all' || item.country === countryFilter)
            .map((item) => item.city);

        return [
            { value: 'all', label: t('properties.index.all', 'All') },
            ...Array.from(new Set(list))
                .sort((a, b) => a.localeCompare(b))
                .map((city) => ({ value: city, label: city })),
        ];
    }, [properties, countryFilter, t]);

    const amenityOptions = useMemo<ChoiceOption[]>(() => {
        return amenities.map((amenity) => ({
            value: String(amenity.id),
            label: amenity.icon
                ? `<i class="${sanitizeIconClass(amenity.icon)}"></i> ${amenity.name}`
                : amenity.name,
        }));
    }, [amenities]);

    const selectedAmenityDisplay = useMemo(() => {
        const selectedSet = new Set(selectedAmenities);

        return amenities.filter((amenity) => selectedSet.has(String(amenity.id)));
    }, [amenities, selectedAmenities]);

    const filteredProperties = useMemo(() => {
        return properties.filter((property) => {
            const haystack = [
                property.title,
                property.description,
                property.address,
                property.city,
                property.country,
                property.type,
                property.status,
                String(property.max_guests),
                String(property.bedrooms),
                String(property.beds),
                String(property.single_beds),
                String(property.bathrooms),
                ...property.amenities,
                property.check_in_time,
                property.check_out_time,
            ]
                .join(' ')
                .toLowerCase();

            if (
                searchTerm.trim() !== '' &&
                !haystack.includes(searchTerm.toLowerCase().trim())
            ) {
                return false;
            }

            if (typeFilter !== 'all' && property.type !== typeFilter) {
                return false;
            }

            if (statusFilter !== 'all' && property.status !== statusFilter) {
                return false;
            }

            if (
                cityFilter !== 'all' &&
                property.city !== cityFilter
            ) {
                return false;
            }

            if (
                countryFilter !== 'all' &&
                property.country !== countryFilter
            ) {
                return false;
            }

            if (freeCancellationFilter && !property.free_cancellation) {
                return false;
            }

            if (
                maxGuestsFilter !== '' &&
                property.max_guests < Number(maxGuestsFilter)
            ) {
                return false;
            }

            if (
                bedroomsFilter !== '' &&
                property.bedrooms < Number(bedroomsFilter)
            ) {
                return false;
            }

            if (doubleBedsFilter !== '' && property.beds < Number(doubleBedsFilter)) {
                return false;
            }

            if (
                singleBedsFilter !== '' &&
                property.single_beds < Number(singleBedsFilter)
            ) {
                return false;
            }

            if (
                bathroomsFilter !== '' &&
                property.bathrooms < Number(bathroomsFilter)
            ) {
                return false;
            }

            if (selectedAmenities.length > 0) {
                const amenityIds = property.amenity_ids.map((item) => String(item));

                const hasAllSelectedAmenities = selectedAmenities.every((amenityId) =>
                    amenityIds.includes(amenityId),
                );

                if (!hasAllSelectedAmenities) {
                    return false;
                }
            }

            return true;
        });
    }, [
        properties,
        searchTerm,
        typeFilter,
        statusFilter,
        cityFilter,
        countryFilter,
        freeCancellationFilter,
        maxGuestsFilter,
        bedroomsFilter,
        doubleBedsFilter,
        singleBedsFilter,
        bathroomsFilter,
        selectedAmenities,
    ]);

    const visibleProperties = useMemo(
        () => filteredProperties.slice(0, visibleCount),
        [filteredProperties, visibleCount],
    );

    const hasMore = visibleCount < filteredProperties.length;

    const activeFiltersCount = useMemo(() => {
        let count = 0;

        if (searchTerm.trim() !== '') {
count += 1;
}

        if (typeFilter !== 'all') {
count += 1;
}

        if (statusFilter !== 'all') {
count += 1;
}

        if (countryFilter !== 'all') {
count += 1;
}

        if (cityFilter !== 'all') {
count += 1;
}

        if (freeCancellationFilter) {
count += 1;
}

        if (maxGuestsFilter !== '') {
count += 1;
}

        if (bedroomsFilter !== '') {
count += 1;
}

        if (doubleBedsFilter !== '') {
count += 1;
}

        if (singleBedsFilter !== '') {
count += 1;
}

        if (bathroomsFilter !== '') {
count += 1;
}

        if (selectedAmenities.length > 0) {
count += 1;
}

        return count;
    }, [
        searchTerm,
        typeFilter,
        statusFilter,
        countryFilter,
        cityFilter,
        freeCancellationFilter,
        maxGuestsFilter,
        bedroomsFilter,
        doubleBedsFilter,
        singleBedsFilter,
        bathroomsFilter,
        selectedAmenities,
    ]);

    useEffect(() => {
        revealObserverRef.current = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    const id = Number((entry.target as HTMLElement).dataset.cardId);

                    if (Number.isNaN(id)) {
                        observer.unobserve(entry.target);

                        return;
                    }

                    setRevealedCards((previous) =>
                        previous[id] ? previous : { ...previous, [id]: true },
                    );

                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.1,
                root: cardsScrollRef.current ?? null,
                rootMargin: '0px 0px -8% 0px',
            },
        );

        pendingElementsRef.current.forEach((element) => {
            revealObserverRef.current?.observe(element);
        });
        pendingElementsRef.current = [];

        return () => {
            revealObserverRef.current?.disconnect();
            revealObserverRef.current = null;
            pendingElementsRef.current = [];
        };
    }, []);

    useEffect(() => {
        const node = loadMoreRef.current;

        if (!node || !hasMore) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (!entries[0]?.isIntersecting) {
                    return;
                }

                setVisibleCount((previous) =>
                    Math.min(previous + PAGE_SIZE, filteredProperties.length),
                );
            },
            {
                threshold: 0.1,
                root: cardsScrollRef.current ?? null,
                rootMargin: '0px 0px 220px 0px',
            },
        );

        observer.observe(node);

        return () => observer.disconnect();
    }, [hasMore, filteredProperties.length]);

    const registerCard = (id: number) => (element: HTMLElement | null) => {
        if (!element) {
            return;
        }

        element.dataset.cardId = String(id);

        if (revealObserverRef.current) {
            revealObserverRef.current.observe(element);

            return;
        }

        pendingElementsRef.current.push(element);
    };

    function resetVisible() {
        setVisibleCount(PAGE_SIZE);
    }

    function clearFilters() {
        setSearchTerm('');
        setTypeFilter('all');
        setStatusFilter('all');
        setCityFilter('all');
        setCountryFilter('all');
        setMaxGuestsFilter('');
        setBedroomsFilter('');
        setDoubleBedsFilter('');
        setSingleBedsFilter('');
        setBathroomsFilter('');
        setFreeCancellationFilter(false);
        setSelectedAmenities([]);
        resetVisible();
    }

    function renderFiltersPanel(scope: 'desktop' | 'mobile') {
        return (
            <section className="rounded-2xl border border-border/70 bg-card/50 p-5 backdrop-blur">
                <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                        {t('properties.index.filters_title', 'Filters')}
                    </h2>
                    <span className="text-xs text-muted-foreground">
                        {filteredProperties.length} / {properties.length}
                    </span>
                </div>

                <div className="space-y-3">
                    <div>
                        <Label htmlFor={`search-${scope}`} className="mb-1 block text-xs">{t('properties.index.filter_search', 'Search')}</Label>
                        <div className="relative">
                            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id={`search-${scope}`}
                                value={searchTerm}
                                onChange={(event) => {
                                    setSearchTerm(event.target.value);
                                    resetVisible();
                                }}
                                placeholder={t('properties.index.search_placeholder', 'Title, city, country, type...')}
                                className="pl-9"
                            />
                        </div>
                    </div>

                    <div>
                        <Label className="mb-1 block text-xs">{t('properties.form.type', 'Type')}</Label>
                        <ChoicesSelect
                            name={`type-filter-${scope}`}
                            options={typeOptions}
                            defaultValue={typeFilter}
                            searchEnabled
                            onChange={(event) => {
                                setTypeFilter(event.target.value);
                                resetVisible();
                            }}
                        />
                    </div>

                    <div>
                        <Label className="mb-1 block text-xs">{t('properties.form.status', 'Status')}</Label>
                        <ChoicesSelect
                            name={`status-filter-${scope}`}
                            options={statusOptions}
                            defaultValue={statusFilter}
                            searchEnabled
                            onChange={(event) => {
                                setStatusFilter(event.target.value);
                                resetVisible();
                            }}
                        />
                    </div>

                    <div>
                        <Label className="mb-1 block text-xs">{t('properties.form.country', 'Country')}</Label>
                        <ChoicesSelect
                            name={`country-filter-${scope}`}
                            options={countryOptions}
                            defaultValue={countryFilter}
                            searchEnabled
                            onChange={(event) => {
                                const nextCountry = event.target.value;
                                setCountryFilter(nextCountry);
                                setCityFilter('all');
                                resetVisible();
                            }}
                        />
                    </div>

                    <div>
                        <Label className="mb-1 block text-xs">{t('properties.form.city', 'City')}</Label>
                        <ChoicesSelect
                            name={`city-filter-${scope}`}
                            options={cityOptions}
                            defaultValue={cityFilter}
                            searchEnabled
                            onChange={(event) => {
                                setCityFilter(event.target.value);
                                resetVisible();
                            }}
                        />
                    </div>

                    <label className="flex items-center gap-2 pt-1 text-sm">
                        <input
                            type="checkbox"
                            checked={freeCancellationFilter}
                            onChange={(event) => {
                                setFreeCancellationFilter(event.target.checked);
                                resetVisible();
                            }}
                            className="size-4"
                        />
                        {t('properties.index.filter_free_cancellation', 'Free cancellation')}
                    </label>

                    <div>
                        <Label className="mb-1 block text-xs">{t('properties.form.max_guests', 'Max guests')}</Label>
                        <Input
                            type="number"
                            min={0}
                            value={maxGuestsFilter}
                            onChange={(event) => {
                                setMaxGuestsFilter(event.target.value);
                                resetVisible();
                            }}
                        />
                    </div>

                    <div>
                        <Label className="mb-1 block text-xs">{t('properties.form.bedrooms', 'Bedrooms')}</Label>
                        <Input
                            type="number"
                            min={0}
                            value={bedroomsFilter}
                            onChange={(event) => {
                                setBedroomsFilter(event.target.value);
                                resetVisible();
                            }}
                        />
                    </div>

                    <div>
                        <Label className="mb-1 block text-xs">{t('properties.form.double_beds', 'Double beds')}</Label>
                        <Input
                            type="number"
                            min={0}
                            value={doubleBedsFilter}
                            onChange={(event) => {
                                setDoubleBedsFilter(event.target.value);
                                resetVisible();
                            }}
                        />
                    </div>

                    <div>
                        <Label className="mb-1 block text-xs">{t('properties.form.single_beds', 'Single beds')}</Label>
                        <Input
                            type="number"
                            min={0}
                            value={singleBedsFilter}
                            onChange={(event) => {
                                setSingleBedsFilter(event.target.value);
                                resetVisible();
                            }}
                        />
                    </div>

                    <div>
                        <Label className="mb-1 block text-xs">{t('properties.form.bathrooms', 'Bathrooms')}</Label>
                        <Input
                            type="number"
                            min={0}
                            value={bathroomsFilter}
                            onChange={(event) => {
                                setBathroomsFilter(event.target.value);
                                resetVisible();
                            }}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="block text-xs">{t('properties.index.filter_amenities_typology', 'Amenities typology')}</Label>
                        <ChoicesSelect
                            id={`amenities-filter-${scope}`}
                            name={`amenities-filter-${scope}[]`}
                            multiple
                            options={amenityOptions}
                            defaultValues={selectedAmenities}
                            searchEnabled
                            allowHTML
                            searchPlaceholderValue={t('common.search')}
                            noResultsText={t('common.no_results')}
                            onChange={(event) => {
                                const values = Array.from(
                                    event.target.selectedOptions,
                                    (option) => option.value,
                                );
                                setSelectedAmenities(values);
                                resetVisible();
                            }}
                        />

                        <div className="max-h-32 overflow-auto rounded-md border border-border/70 p-2">
                            {selectedAmenityDisplay.length === 0 ? (
                                <p className="text-xs text-muted-foreground">
                                    {t('properties.index.no_selected_amenities', 'No amenities selected.')}
                                </p>
                            ) : (
                                <div className="flex flex-wrap gap-1.5">
                                    {selectedAmenityDisplay.map((amenity) => (
                                        <span
                                            key={amenity.id}
                                            className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-xs text-primary"
                                        >
                                            {amenity.icon ? (
                                                <i className={sanitizeIconClass(amenity.icon)} aria-hidden="true" />
                                            ) : null}
                                            <span>{amenity.name}</span>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={clearFilters}
                    >
                        {t('properties.index.clear_filters', 'Clear filters')}
                    </Button>
                </div>
            </section>
        );
    }

    function destroyProperty(slug: string) {
        if (!window.confirm(t('properties.index.delete_confirm', 'Delete this property?'))) {
            return;
        }

        router.delete(`/properties/${slug}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('properties.index.head_title', 'Properties')} />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">{t('properties.index.title', 'My properties')}</h1>
                        <p className="text-sm text-muted-foreground">
                            {t('properties.index.subtitle', 'Manage listings, amenities and media.')}
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/properties/create">{t('properties.index.create_action', 'New property')}</Link>
                    </Button>
                </div>

                <div className="grid gap-6 xl:h-[calc(100vh-12rem)] xl:grid-cols-[300px_minmax(0,1fr)]">
                    <aside className="hidden space-y-4 xl:block xl:h-full xl:overflow-y-auto xl:pr-1">
                        {renderFiltersPanel('desktop')}
                    </aside>

                    <section ref={cardsScrollRef} className="space-y-4 xl:h-full xl:overflow-y-auto xl:pr-1">
                        <div className="flex items-center justify-between gap-3 xl:hidden">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setMobileFiltersOpen(true)}
                            >
                                <SlidersHorizontal className="mr-2 size-4" />
                                {t('properties.index.filters_title', 'Filters')}
                                {activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ''}
                            </Button>
                            <span className="text-xs text-muted-foreground">
                                {filteredProperties.length} / {properties.length}
                            </span>
                        </div>

                        <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                            <SheetContent side="left" className="w-[92vw] max-w-md overflow-y-auto p-0">
                                <SheetHeader>
                                    <SheetTitle>{t('properties.index.filters_title', 'Filters')}</SheetTitle>
                                    <SheetDescription>
                                        {t('properties.index.filters_mobile_hint', 'Adjust filters and close this panel to see results.')}
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="p-4 pt-0">{renderFiltersPanel('mobile')}</div>
                            </SheetContent>
                        </Sheet>

                        {filteredProperties.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                                {t('properties.index.empty', 'No properties found with the current filters.')}
                            </div>
                        ) : null}

                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {visibleProperties.map((property) => (
                                <div
                                    key={property.id}
                                    ref={registerCard(property.id)}
                                    className={`transition-all duration-500 ${
                                        revealedCards[property.id]
                                            ? 'translate-y-0 opacity-100'
                                            : 'translate-y-6 opacity-0'
                                    }`}
                                >
                                    <SpotlightCard
                                        spotlightColor="rgba(34, 197, 94, 0.15)"
                                        className="p-0"
                                    >
                                        {property.favorite_image_url ? (
                                            <img
                                                src={property.favorite_image_url}
                                                alt={property.favorite_image_alt ?? property.title}
                                                className="h-44 w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-44 items-center justify-center bg-muted text-sm text-muted-foreground">
                                                {t('properties.index.no_image', 'No image')}
                                            </div>
                                        )}

                                        <div className="space-y-3 p-5">
                                            <div className="flex items-start justify-between gap-3">
                                                <h2 className="line-clamp-2 text-lg font-semibold tracking-tight">
                                                    {property.title}
                                                </h2>
                                                <span className="rounded-full border border-border px-2 py-1 text-xs">
                                                    {t(`properties.form.statuses.${property.status}`, property.status)}
                                                </span>
                                            </div>

                                            <p className="line-clamp-2 text-sm text-muted-foreground">
                                                {property.address}
                                            </p>

                                            <p className="text-sm text-muted-foreground">
                                                {property.city}, {property.country} · {t(`properties.form.types.${property.type}`, property.type)}
                                            </p>

                                            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                                <p className="inline-flex items-center gap-1"><Users className="size-3.5" />{property.max_guests}</p>
                                                <p className="inline-flex items-center gap-1"><Building2 className="size-3.5" />{property.bedrooms}</p>
                                                <p className="inline-flex items-center gap-1"><BedDouble className="size-3.5" />{property.beds}</p>
                                                <p className="inline-flex items-center gap-1"><VenetianMask className="size-3.5" />{property.single_beds}</p>
                                                <p className="inline-flex items-center gap-1"><Bath className="size-3.5" />{property.bathrooms}</p>
                                                <p className="inline-flex items-center gap-1"><ShieldCheck className="size-3.5" />{property.amenities_count}</p>
                                            </div>

                                            {property.amenities.length > 0 ? (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {property.amenities.slice(0, 4).map((amenity) => (
                                                        <span
                                                            key={`${property.id}-${amenity}`}
                                                            className="rounded-full border border-border/80 bg-background/60 px-2 py-0.5 text-[10px] text-muted-foreground"
                                                        >
                                                            {amenity}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : null}

                                            <div className="flex gap-2 pt-1">
                                                <Button variant="outline" asChild>
                                                    <Link href={`/properties/${property.slug}`}>
                                                        {t('properties.index.view_action', 'View')}
                                                    </Link>
                                                </Button>
                                                <Button variant="outline" asChild>
                                                    <Link href={`/properties/${property.slug}/edit`}>
                                                        {t('properties.index.edit_action', 'Edit')}
                                                    </Link>
                                                </Button>
                                                <Button variant="destructive" onClick={() => destroyProperty(property.slug)}>
                                                    {t('properties.index.delete_action', 'Delete')}
                                                </Button>
                                            </div>
                                        </div>
                                    </SpotlightCard>
                                </div>
                            ))}
                        </div>

                        {hasMore && (
                            <div ref={loadMoreRef} className="py-2 text-center text-xs text-muted-foreground">
                                {t('properties.index.loading_more', 'Loading more properties...')}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </AppLayout>
    );
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
