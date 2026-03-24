import { Transition } from '@headlessui/react';
import { Form, usePage } from '@inertiajs/react';
import { Compass, Images, ListChecks, MapPin, ShieldCheck } from 'lucide-react';
import type { FormEvent } from 'react';
import { useMemo, useRef, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import ChoicesSelect from '@/components/ui/choices-select';
import ImageDropzone from '@/components/ui/image-dropzone';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import RichTextEditor from '@/components/ui/rich-text-editor';
import { useTranslations } from '@/hooks/use-translations';

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

type PropertyFormData = {
    title: string;
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
    single_beds: number;
    bathrooms: number;
    check_in_time: string;
    check_out_time: string;
    notes?: string | null;
    status: string;
    amenity_ids?: number[];
    images?: ExistingImage[];
    house_rules?: {
        check_in?: string;
        check_out?: string;
        cancellation_policy?: string;
        damage_deposit?: string;
        children_policy?: string;
        age_restriction?: string;
        free_cancellation?: boolean;
        smoking_allowed?: boolean;
        pets_allowed?: boolean;
    };
};

type PropertyFormProps = {
    action: string;
    method: 'post' | 'put';
    submitLabel: string;
    property?: PropertyFormData;
    amenities: AmenityOption[];
};

type StepDefinition = {
    key: string;
    title: string;
    description: string;
};

type GeocodeResponse = {
    latitude: number;
    longitude: number;
};

export default function PropertyForm({
    action,
    method,
    submitLabel,
    property,
    amenities,
}: PropertyFormProps) {
    const { t } = useTranslations();
    const { locale } = usePage<{ locale: string }>().props;
    const [currentStep, setCurrentStep] = useState(0);
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [geocodingError, setGeocodingError] = useState<string | null>(null);
    const [stepError, setStepError] = useState<string | null>(null);
    const [addressValue, setAddressValue] = useState(property?.address ?? '');
    const [cityValue, setCityValue] = useState(property?.city ?? '');
    const [countryValue, setCountryValue] = useState(property?.country ?? '');
    const [existingImages, setExistingImages] = useState<ExistingImage[]>(
        property?.images ?? [],
    );
    const [favoriteImageId, setFavoriteImageId] = useState<number | null>(
        property?.images?.[0]?.id ?? null,
    );
    const [favoriteUploadIndex, setFavoriteUploadIndex] = useState<number | null>(
        null,
    );
    const [removedImageIds, setRemovedImageIds] = useState<number[]>([]);

    const latitudeRef = useRef<HTMLInputElement | null>(null);
    const longitudeRef = useRef<HTMLInputElement | null>(null);

    const steps = useMemo<StepDefinition[]>(
        () => [
            {
                key: 'general',
                title: t('properties.form.steps.general_title', 'General'),
                description: t(
                    'properties.form.steps.general_description',
                    'Name, description and listing status.',
                ),
            },
            {
                key: 'location',
                title: t('properties.form.steps.location_title', 'Location'),
                description: t(
                    'properties.form.steps.location_description',
                    'Address and map coordinates.',
                ),
            },
            {
                key: 'details',
                title: t('properties.form.steps.details_title', 'Details'),
                description: t(
                    'properties.form.steps.details_description',
                    'Capacity, schedules and amenities.',
                ),
            },
            {
                key: 'rules',
                title: t('properties.form.steps.rules_title', 'Rules'),
                description: t(
                    'properties.form.steps.rules_description',
                    'Policies, notes and restrictions.',
                ),
            },
            {
                key: 'media',
                title: t('properties.form.steps.media_title', 'Media'),
                description: t(
                    'properties.form.steps.media_description',
                    'Optional image upload.',
                ),
            },
        ],
        [t],
    );

    const propertyTypeOptions = useMemo(
        () => [
            { value: 'house', label: t('properties.form.types.house', 'House') },
            {
                value: 'apartment',
                label: t('properties.form.types.apartment', 'Apartment'),
            },
            { value: 'villa', label: t('properties.form.types.villa', 'Villa') },
            { value: 'cabin', label: t('properties.form.types.cabin', 'Cabin') },
            { value: 'room', label: t('properties.form.types.room', 'Room') },
            { value: 'other', label: t('properties.form.types.other', 'Other') },
        ],
        [t],
    );

    const statusOptions = useMemo(
        () => [
            { value: 'draft', label: t('properties.form.statuses.draft', 'Draft') },
            {
                value: 'published',
                label: t('properties.form.statuses.published', 'Published'),
            },
        ],
        [t],
    );

    const amenityChoices = useMemo(
        () =>
            amenities.map((amenity) => ({
                value: String(amenity.id),
                label: amenity.icon
                    ? `<i class="${sanitizeIconClass(amenity.icon)}"></i> ${amenity.name}`
                    : amenity.name,
            })),
        [amenities],
    );

    const amenityDefaultValues = useMemo(
        () => property?.amenity_ids?.map(String) ?? [],
        [property?.amenity_ids],
    );

    async function geocodePropertyAddress() {
        const address = addressValue.trim();
        const city = cityValue.trim();
        const country = countryValue.trim();
        const fullAddress = [address, city, country].filter(Boolean).join(', ');

        if (fullAddress === '') {
            setGeocodingError(
                t(
                    'properties.form.geocoding_missing_address',
                    'Please fill in address, city and country first.',
                ),
            );

            return;
        }

        setIsGeocoding(true);
        setGeocodingError(null);

        try {
            const response = await fetch(
                `/properties/geocode?full_address=${encodeURIComponent(fullAddress)}`,
                {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                    },
                },
            );

            if (!response.ok) {
                throw new Error('Geocoding request failed');
            }

            const payload = (await response.json()) as GeocodeResponse;

            if (latitudeRef.current) {
                latitudeRef.current.value = String(payload.latitude);
            }

            if (longitudeRef.current) {
                longitudeRef.current.value = String(payload.longitude);
            }
        } catch {
            setGeocodingError(
                t(
                    'properties.form.geocoding_error',
                    'Unable to resolve coordinates for this address right now.',
                ),
            );
        } finally {
            setIsGeocoding(false);
        }
    }

    function goNextStep() {
        if (!validateCurrentStep()) {
            return;
        }

        setCurrentStep((previous) => Math.min(previous + 1, steps.length - 1));
    }

    function goPreviousStep() {
        setStepError(null);
        setCurrentStep((previous) => Math.max(previous - 1, 0));
    }

    function validateCurrentStep(): boolean {
        const stepElement = document.querySelector<HTMLElement>(
            `[data-property-step="${currentStep}"]`,
        );

        if (!stepElement) {
            setStepError(null);

            return true;
        }

        const fields = stepElement.querySelectorAll<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >('input, select, textarea');

        for (const field of fields) {
            if (field.disabled || field.type === 'hidden') {
                continue;
            }

            if (!field.checkValidity()) {
                field.reportValidity();
                setStepError(null);

                return false;
            }
        }

        if (currentStep === 0) {
            const descriptionField = stepElement.querySelector<HTMLInputElement>(
                'input[name="description"]',
            );

            if (!hasMeaningfulRichText(descriptionField?.value)) {
                setStepError(
                    t(
                        'properties.form.validation.description_required',
                        'Description is required before continuing.',
                    ),
                );

                return false;
            }
        }

        setStepError(null);

        return true;
    }

    function removeImage(id: number) {
        setRemovedImageIds((previous) => [...previous, id]);
        setExistingImages((previous) => {
            const next = previous.filter((image) => image.id !== id);

            if (favoriteImageId === id) {
                setFavoriteImageId(next[0]?.id ?? null);
            }

            return next;
        });
    }

    function moveImage(id: number, direction: 'up' | 'down') {
        setExistingImages((previous) => {
            const index = previous.findIndex((image) => image.id === id);

            if (index === -1) {
                return previous;
            }

            const targetIndex = direction === 'up' ? index - 1 : index + 1;

            if (targetIndex < 0 || targetIndex >= previous.length) {
                return previous;
            }

            const next = [...previous];
            [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
            setFavoriteImageId(next[0]?.id ?? null);

            return next;
        });
    }

    function markImageAsFavorite(id: number) {
        setExistingImages((previous) => {
            const current = previous.find((image) => image.id === id);

            if (!current) {
                return previous;
            }

            const next = [
                current,
                ...previous.filter((image) => image.id !== id),
            ];

            return next;
        });

        setFavoriteImageId(id);
    }

    function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
        if (currentStep >= steps.length - 1) {
            return;
        }

        event.preventDefault();
        goNextStep();
    }

    return (
        <Form
            action={action}
            method={method}
            options={{ preserveScroll: true, preserveState: true }}
            onSubmit={handleFormSubmit}
            className="space-y-8"
        >
            {({ processing, errors, recentlySuccessful }) => (
                <>
                    <input type="hidden" name="source_locale" value={locale} />

                    {removedImageIds.map((id) => (
                        <input
                            key={`remove-${id}`}
                            type="hidden"
                            name="remove_image_ids[]"
                            value={id}
                        />
                    ))}

                    {favoriteImageId !== null && (
                        <input
                            type="hidden"
                            name="favorite_image_id"
                            value={favoriteImageId}
                        />
                    )}

                    {favoriteUploadIndex !== null && (
                        <input
                            type="hidden"
                            name="favorite_upload_index"
                            value={favoriteUploadIndex}
                        />
                    )}

                    {existingImages.map((image) => (
                        <input
                            key={`order-${image.id}`}
                            type="hidden"
                            name="image_order[]"
                            value={image.id}
                        />
                    ))}

                    <section className="rounded-2xl border border-border bg-card p-5">
                        <ol className="grid gap-3 md:grid-cols-5">
                            {steps.map((step, index) => (
                                <li
                                    key={step.key}
                                    className={`rounded-xl border p-3 transition ${
                                        index === currentStep
                                            ? 'border-primary bg-primary/10'
                                            : index < currentStep
                                              ? 'border-primary/40 bg-primary/5'
                                              : 'border-border bg-muted/20'
                                    }`}
                                >
                                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                        {index + 1}. {step.title}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {step.description}
                                    </p>
                                </li>
                            ))}
                        </ol>
                    </section>

                    <section
                        data-property-step="0"
                        className={`space-y-4 rounded-2xl border border-border bg-card p-5 ${
                            currentStep === 0 ? 'block' : 'hidden'
                        }`}
                    >
                        <header className="space-y-1">
                            <h2 className="text-lg font-semibold">
                                {t('properties.form.sections.general', 'General information')}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {t(
                                    'properties.form.sections.general_description',
                                    'Start with the key listing details.',
                                )}
                            </p>
                        </header>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="title">{t('common.name', 'Name')}</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    required
                                    defaultValue={property?.title}
                                    placeholder={t(
                                        'properties.form.placeholder_title',
                                        'House with garden in the city center',
                                    )}
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="description">
                                    {t('properties.form.description', 'Description')}
                                </Label>
                                <RichTextEditor
                                    id="description"
                                    name="description"
                                    defaultValue={property?.description}
                                    placeholder={t(
                                        'properties.form.placeholder_description',
                                        'Explain what makes this property unique...',
                                    )}
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="type">
                                    {t('properties.form.type', 'Type')}
                                </Label>
                                <ChoicesSelect
                                    id="type"
                                    name="type"
                                    options={propertyTypeOptions}
                                    defaultValue={property?.type ?? 'apartment'}
                                />
                                <InputError message={errors.type} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="status">
                                    {t('properties.form.status', 'Status')}
                                </Label>
                                <ChoicesSelect
                                    id="status"
                                    name="status"
                                    options={statusOptions}
                                    defaultValue={property?.status ?? 'draft'}
                                />
                                <InputError message={errors.status} />
                            </div>
                        </div>
                    </section>

                    <section
                        data-property-step="1"
                        className={`space-y-4 rounded-2xl border border-border bg-card p-5 ${
                            currentStep === 1 ? 'block' : 'hidden'
                        }`}
                    >
                        <header className="space-y-1">
                            <h2 className="text-lg font-semibold">
                                {t('properties.form.sections.location', 'Location')}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {t(
                                    'properties.form.sections.location_description',
                                    'Use geocoding to autofill latitude and longitude from the full address.',
                                )}
                            </p>
                        </header>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="address">
                                    {t('properties.form.address', 'Address')}
                                </Label>
                                <Input
                                    id="address"
                                    name="address"
                                    required
                                    value={addressValue}
                                    onChange={(event) => setAddressValue(event.target.value)}
                                />
                                <InputError message={errors.address} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="city">{t('properties.form.city', 'City')}</Label>
                                <Input
                                    id="city"
                                    name="city"
                                    required
                                    value={cityValue}
                                    onChange={(event) => setCityValue(event.target.value)}
                                />
                                <InputError message={errors.city} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="country">
                                    {t('properties.form.country', 'Country')}
                                </Label>
                                <Input
                                    id="country"
                                    name="country"
                                    required
                                    value={countryValue}
                                    onChange={(event) => setCountryValue(event.target.value)}
                                />
                                <InputError message={errors.country} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="latitude">
                                    {t('properties.form.latitude', 'Latitude')}
                                </Label>
                                <Input
                                    ref={latitudeRef}
                                    id="latitude"
                                    type="text"
                                    inputMode="decimal"
                                    name="latitude"
                                    placeholder="39,4336454"
                                    defaultValue={property?.latitude ?? ''}
                                />
                                <InputError message={errors.latitude} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="longitude">
                                    {t('properties.form.longitude', 'Longitude')}
                                </Label>
                                <Input
                                    ref={longitudeRef}
                                    id="longitude"
                                    type="text"
                                    inputMode="decimal"
                                    name="longitude"
                                    placeholder="2,1839267"
                                    defaultValue={property?.longitude ?? ''}
                                />
                                <InputError message={errors.longitude} />
                            </div>

                            <div className="md:col-span-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={geocodePropertyAddress}
                                    disabled={isGeocoding}
                                >
                                    <MapPin className="mr-2 size-4" />
                                    {isGeocoding
                                        ? t('properties.form.geocoding_loading', 'Locating...')
                                        : t('properties.form.geocoding_action', 'Autofill coordinates')}
                                </Button>
                                {geocodingError && (
                                    <p className="mt-2 text-sm text-destructive">
                                        {geocodingError}
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>

                    <section
                        data-property-step="2"
                        className={`space-y-4 rounded-2xl border border-border bg-card p-5 ${
                            currentStep === 2 ? 'block' : 'hidden'
                        }`}
                    >
                        <header className="space-y-1">
                            <h2 className="text-lg font-semibold">
                                {t('properties.form.sections.details', 'Capacity and amenities')}
                            </h2>
                        </header>

                        <div className="grid gap-4 md:grid-cols-5">
                            <div className="grid gap-2">
                                <Label htmlFor="max_guests">
                                    {t('properties.form.max_guests', 'Max guests')}
                                </Label>
                                <Input
                                    id="max_guests"
                                    type="number"
                                    name="max_guests"
                                    min={1}
                                    required
                                    defaultValue={property?.max_guests ?? 2}
                                />
                                <InputError message={errors.max_guests} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="bedrooms">
                                    {t('properties.form.bedrooms', 'Bedrooms')}
                                </Label>
                                <Input
                                    id="bedrooms"
                                    type="number"
                                    name="bedrooms"
                                    min={0}
                                    required
                                    defaultValue={property?.bedrooms ?? 1}
                                />
                                <InputError message={errors.bedrooms} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="beds">
                                    {t('properties.form.double_beds', 'Double beds')}
                                </Label>
                                <Input
                                    id="beds"
                                    type="number"
                                    name="beds"
                                    min={0}
                                    required
                                    defaultValue={property?.beds ?? 1}
                                />
                                <InputError message={errors.beds} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="single_beds">
                                    {t('properties.form.single_beds', 'Single beds')}
                                </Label>
                                <Input
                                    id="single_beds"
                                    type="number"
                                    name="single_beds"
                                    min={0}
                                    required
                                    defaultValue={property?.single_beds ?? 0}
                                />
                                <InputError message={errors.single_beds} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="bathrooms">
                                    {t('properties.form.bathrooms', 'Bathrooms')}
                                </Label>
                                <Input
                                    id="bathrooms"
                                    type="number"
                                    name="bathrooms"
                                    min={1}
                                    required
                                    defaultValue={property?.bathrooms ?? 1}
                                />
                                <InputError message={errors.bathrooms} />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="check_in_time">
                                    {t('properties.form.check_in', 'Check in')}
                                </Label>
                                <Input
                                    id="check_in_time"
                                    type="time"
                                    name="check_in_time"
                                    required
                                    defaultValue={property?.check_in_time ?? '15:00'}
                                />
                                <InputError message={errors.check_in_time} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="check_out_time">
                                    {t('properties.form.check_out', 'Check out')}
                                </Label>
                                <Input
                                    id="check_out_time"
                                    type="time"
                                    name="check_out_time"
                                    required
                                    defaultValue={property?.check_out_time ?? '11:00'}
                                />
                                <InputError message={errors.check_out_time} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="amenities">
                                {t('properties.form.amenities', 'Amenities')}
                            </Label>
                            <ChoicesSelect
                                id="amenities"
                                name="amenities[]"
                                multiple
                                options={amenityChoices}
                                defaultValues={amenityDefaultValues}
                                searchEnabled
                                allowHTML
                                searchPlaceholderValue={t('common.search')}
                                noResultsText={t('common.no_results')}
                            />
                            <InputError message={errors.amenities} />
                        </div>
                    </section>

                    <section
                        data-property-step="3"
                        className={`space-y-4 rounded-2xl border border-border bg-card p-5 ${
                            currentStep === 3 ? 'block' : 'hidden'
                        }`}
                    >
                        <header className="space-y-1">
                            <h2 className="text-lg font-semibold">
                                {t('properties.form.sections.rules', 'Rules and notes')}
                            </h2>
                        </header>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="house_rules_check_in">
                                    {t('properties.form.rule_check_in', 'Check-in rule')}
                                </Label>
                                <Input
                                    id="house_rules_check_in"
                                    name="house_rules[check_in]"
                                    defaultValue={property?.house_rules?.check_in ?? ''}
                                />
                                <InputError message={errors['house_rules.check_in']} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="house_rules_check_out">
                                    {t('properties.form.rule_check_out', 'Check-out rule')}
                                </Label>
                                <Input
                                    id="house_rules_check_out"
                                    name="house_rules[check_out]"
                                    defaultValue={property?.house_rules?.check_out ?? ''}
                                />
                                <InputError message={errors['house_rules.check_out']} />
                            </div>

                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="house_rules_cancellation_policy">
                                    {t('properties.form.rule_cancellation', 'Cancellation policy')}
                                </Label>
                                <RichTextEditor
                                    id="house_rules_cancellation_policy"
                                    name="house_rules[cancellation_policy]"
                                    defaultValue={
                                        property?.house_rules?.cancellation_policy ?? ''
                                    }
                                />
                                <InputError
                                    message={errors['house_rules.cancellation_policy']}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="house_rules_damage_deposit">
                                    {t('properties.form.rule_damage_deposit', 'Damage deposit')}
                                </Label>
                                <Input
                                    id="house_rules_damage_deposit"
                                    name="house_rules[damage_deposit]"
                                    defaultValue={
                                        property?.house_rules?.damage_deposit ?? ''
                                    }
                                />
                                <InputError
                                    message={errors['house_rules.damage_deposit']}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="house_rules_age_restriction">
                                    {t('properties.form.rule_age_restriction', 'Age restriction')}
                                </Label>
                                <Input
                                    id="house_rules_age_restriction"
                                    name="house_rules[age_restriction]"
                                    defaultValue={
                                        property?.house_rules?.age_restriction ?? ''
                                    }
                                />
                                <InputError
                                    message={errors['house_rules.age_restriction']}
                                />
                            </div>

                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="notes">
                                    {t('properties.form.notes', 'Notes')}
                                </Label>
                                <RichTextEditor
                                    id="notes"
                                    name="notes"
                                    defaultValue={property?.notes ?? ''}
                                />
                                <InputError message={errors.notes} />
                            </div>

                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    name="house_rules[free_cancellation]"
                                    value="1"
                                    defaultChecked={
                                        property?.house_rules?.free_cancellation ?? false
                                    }
                                    className="size-4"
                                />
                                {t('properties.form.free_cancellation', 'Free cancellation')}
                            </label>

                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    name="house_rules[smoking_allowed]"
                                    value="1"
                                    defaultChecked={
                                        property?.house_rules?.smoking_allowed ?? false
                                    }
                                    className="size-4"
                                />
                                {t('properties.form.smoking_allowed', 'Smoking allowed')}
                            </label>

                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    name="house_rules[pets_allowed]"
                                    value="1"
                                    defaultChecked={
                                        property?.house_rules?.pets_allowed ?? false
                                    }
                                    className="size-4"
                                />
                                {t('properties.form.pets_allowed', 'Pets allowed')}
                            </label>
                        </div>
                    </section>

                    <section
                        data-property-step="4"
                        className={`space-y-4 rounded-2xl border border-border bg-card p-5 ${
                            currentStep === 4 ? 'block' : 'hidden'
                        }`}
                    >
                        <header className="space-y-1">
                            <h2 className="text-lg font-semibold">
                                {t('properties.form.sections.media', 'Media (optional)')}
                            </h2>
                        </header>

                        <div className="grid gap-2">
                            <Label htmlFor="images">
                                {t('properties.form.images', 'Images')}
                            </Label>
                            <ImageDropzone
                                id="images"
                                name="images[]"
                                helperText={t(
                                    'properties.form.images_optional',
                                    'Optional: you can upload now or later.',
                                )}
                                favoriteIndex={favoriteUploadIndex}
                                onFavoriteIndexChange={setFavoriteUploadIndex}
                                favoriteLabel={t(
                                    'properties.form.favorite_uploaded',
                                    'Set as favorite',
                                )}
                            />
                            <InputError message={errors.images} />
                        </div>

                        {existingImages.length > 0 && (
                            <div className="grid gap-3 rounded-xl border border-border p-4">
                                <p className="text-sm font-medium">
                                    {t(
                                        'properties.form.existing_images',
                                        'Existing images (you can reorder them)',
                                    )}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {t(
                                        'properties.form.favorite_hint',
                                        'The first image is used as favorite in cards.',
                                    )}
                                </p>
                                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                                    {existingImages.map((image, index) => (
                                        <div
                                            key={image.id}
                                            className="space-y-3 rounded-lg border border-border p-3"
                                        >
                                            <img
                                                src={image.url}
                                                alt={image.alt ?? 'Property image'}
                                                className="h-36 w-full rounded-md object-cover"
                                            />
                                            <div className="grid grid-cols-2 gap-2">
                                                <Button
                                                    type="button"
                                                    variant={
                                                        favoriteImageId === image.id
                                                            ? 'default'
                                                            : 'outline'
                                                    }
                                                    size="sm"
                                                    className="w-full"
                                                    onClick={() =>
                                                        markImageAsFavorite(image.id)
                                                    }
                                                >
                                                    {t(
                                                        'properties.form.favorite_existing',
                                                        'Favorite',
                                                    )}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    className="w-full"
                                                    onClick={() => removeImage(image.id)}
                                                >
                                                    {t('properties.form.remove', 'Remove')}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full"
                                                    onClick={() => moveImage(image.id, 'up')}
                                                    disabled={index === 0}
                                                >
                                                    {t('properties.form.up', 'Up')}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full"
                                                    onClick={() =>
                                                        moveImage(image.id, 'down')
                                                    }
                                                    disabled={
                                                        index === existingImages.length - 1
                                                    }
                                                >
                                                    {t('properties.form.down', 'Down')}
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            {currentStep > 0 && (
                                <Button type="button" variant="outline" onClick={goPreviousStep}>
                                    <Compass className="mr-2 size-4" />
                                    {t('properties.form.previous', 'Previous')}
                                </Button>
                            )}

                            {currentStep < steps.length - 1 ? (
                                <Button type="button" onClick={goNextStep}>
                                    {currentStep === 0 && <ListChecks className="mr-2 size-4" />}
                                    {currentStep === 1 && <MapPin className="mr-2 size-4" />}
                                    {currentStep === 2 && <ShieldCheck className="mr-2 size-4" />}
                                    {currentStep === 3 && <Images className="mr-2 size-4" />}
                                    {t('properties.form.next', 'Next step')}
                                </Button>
                            ) : (
                                <Button disabled={processing}>{submitLabel}</Button>
                            )}
                        </div>

                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-neutral-600">
                                {t('common.saved')}
                            </p>
                        </Transition>

                        {stepError && (
                            <p className="text-sm text-destructive">{stepError}</p>
                        )}
                    </div>
                </>
            )}
        </Form>
    );
}

function hasMeaningfulRichText(value: string | null | undefined): boolean {
    if (!value) {
        return false;
    }

    const plainText = value
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .trim();

    return plainText.length > 0;
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
