import { Transition } from '@headlessui/react';
import { Form } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import ChoicesSelect from '@/components/ui/choices-select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

const propertyTypeOptions = [
    { value: 'house', label: 'House' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'villa', label: 'Villa' },
    { value: 'cabin', label: 'Cabin' },
    { value: 'room', label: 'Room' },
    { value: 'other', label: 'Other' },
];

const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
];

export default function PropertyForm({
    action,
    method,
    submitLabel,
    property,
    amenities,
}: PropertyFormProps) {
    const { t } = useTranslations();
    const [existingImages, setExistingImages] = useState<ExistingImage[]>(
        property?.images ?? [],
    );
    const [removedImageIds, setRemovedImageIds] = useState<number[]>([]);

    const amenityChoices = useMemo(
        () =>
            amenities.map((amenity) => ({
                value: String(amenity.id),
                label: amenity.icon
                    ? `${amenity.icon} ${amenity.name}`
                    : amenity.name,
            })),
        [amenities],
    );

    function removeImage(id: number) {
        setRemovedImageIds((previous) => [...previous, id]);
        setExistingImages((previous) =>
            previous.filter((image) => image.id !== id),
        );
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

            return next;
        });
    }

    return (
        <Form
            action={action}
            method={method}
            options={{ preserveScroll: true }}
            className="space-y-8"
        >
            {({ processing, errors, recentlySuccessful }) => (
                <>
                    {removedImageIds.map((id) => (
                        <input
                            key={`remove-${id}`}
                            type="hidden"
                            name="remove_image_ids[]"
                            value={id}
                        />
                    ))}

                    {existingImages.map((image) => (
                        <input
                            key={`order-${image.id}`}
                            type="hidden"
                            name="image_order[]"
                            value={image.id}
                        />
                    ))}

                    <section className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="title">{t('common.name')}</Label>
                            <Input
                                id="title"
                                name="title"
                                required
                                defaultValue={property?.title}
                                placeholder="Casa con jardin en el centro"
                            />
                            <InputError message={errors.title} />
                        </div>

                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="description">Description</Label>
                            <textarea
                                id="description"
                                name="description"
                                required
                                defaultValue={property?.description}
                                rows={4}
                                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            />
                            <InputError message={errors.description} />
                        </div>

                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                name="address"
                                required
                                defaultValue={property?.address}
                            />
                            <InputError message={errors.address} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                                id="city"
                                name="city"
                                required
                                defaultValue={property?.city}
                            />
                            <InputError message={errors.city} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="country">Country</Label>
                            <Input
                                id="country"
                                name="country"
                                required
                                defaultValue={property?.country}
                            />
                            <InputError message={errors.country} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="latitude">Latitude</Label>
                            <Input
                                id="latitude"
                                type="number"
                                step="0.000001"
                                name="latitude"
                                defaultValue={property?.latitude ?? ''}
                            />
                            <InputError message={errors.latitude} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="longitude">Longitude</Label>
                            <Input
                                id="longitude"
                                type="number"
                                step="0.000001"
                                name="longitude"
                                defaultValue={property?.longitude ?? ''}
                            />
                            <InputError message={errors.longitude} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="type">Type</Label>
                            <ChoicesSelect
                                id="type"
                                name="type"
                                options={propertyTypeOptions}
                                defaultValue={property?.type ?? 'apartment'}
                            />
                            <InputError message={errors.type} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <ChoicesSelect
                                id="status"
                                name="status"
                                options={statusOptions}
                                defaultValue={property?.status ?? 'draft'}
                            />
                            <InputError message={errors.status} />
                        </div>
                    </section>

                    <section className="grid gap-4 md:grid-cols-4">
                        <div className="grid gap-2">
                            <Label htmlFor="max_guests">Max guests</Label>
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
                            <Label htmlFor="bedrooms">Bedrooms</Label>
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
                            <Label htmlFor="beds">Beds</Label>
                            <Input
                                id="beds"
                                type="number"
                                name="beds"
                                min={1}
                                required
                                defaultValue={property?.beds ?? 1}
                            />
                            <InputError message={errors.beds} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="bathrooms">Bathrooms</Label>
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
                    </section>

                    <section className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="check_in_time">Check in</Label>
                            <Input
                                id="check_in_time"
                                type="time"
                                name="check_in_time"
                                required
                                defaultValue={
                                    property?.check_in_time ?? '15:00'
                                }
                            />
                            <InputError message={errors.check_in_time} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="check_out_time">Check out</Label>
                            <Input
                                id="check_out_time"
                                type="time"
                                name="check_out_time"
                                required
                                defaultValue={
                                    property?.check_out_time ?? '11:00'
                                }
                            />
                            <InputError message={errors.check_out_time} />
                        </div>
                    </section>

                    <section className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="amenities">Amenities</Label>
                            <ChoicesSelect
                                id="amenities"
                                name="amenities[]"
                                multiple
                                options={amenityChoices}
                                defaultValues={
                                    property?.amenity_ids?.map(String) ?? []
                                }
                                searchEnabled
                                searchPlaceholderValue={t('common.search')}
                                noResultsText={t('common.no_results')}
                            />
                            <InputError message={errors.amenities} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="images">Images</Label>
                            <Input
                                id="images"
                                type="file"
                                name="images[]"
                                multiple
                                accept="image/png,image/jpeg,image/webp"
                            />
                            <InputError message={errors.images} />
                        </div>

                        {existingImages.length > 0 && (
                            <div className="grid gap-3 rounded-xl border border-border p-4">
                                <p className="text-sm font-medium">
                                    Existing images (you can reorder them)
                                </p>
                                <div className="grid gap-3 md:grid-cols-3">
                                    {existingImages.map((image, index) => (
                                        <div
                                            key={image.id}
                                            className="space-y-2 rounded-lg border border-border p-2"
                                        >
                                            <img
                                                src={image.url}
                                                alt={
                                                    image.alt ??
                                                    'Property image'
                                                }
                                                className="h-28 w-full rounded-md object-cover"
                                            />
                                            <div className="flex gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        moveImage(
                                                            image.id,
                                                            'up',
                                                        )
                                                    }
                                                    disabled={index === 0}
                                                >
                                                    Up
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        moveImage(
                                                            image.id,
                                                            'down',
                                                        )
                                                    }
                                                    disabled={
                                                        index ===
                                                        existingImages.length -
                                                            1
                                                    }
                                                >
                                                    Down
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() =>
                                                        removeImage(image.id)
                                                    }
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>

                    <section className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="house_rules_check_in">
                                Check-in rule
                            </Label>
                            <Input
                                id="house_rules_check_in"
                                name="house_rules[check_in]"
                                defaultValue={
                                    property?.house_rules?.check_in ?? ''
                                }
                            />
                            <InputError
                                message={errors['house_rules.check_in']}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="house_rules_check_out">
                                Check-out rule
                            </Label>
                            <Input
                                id="house_rules_check_out"
                                name="house_rules[check_out]"
                                defaultValue={
                                    property?.house_rules?.check_out ?? ''
                                }
                            />
                            <InputError
                                message={errors['house_rules.check_out']}
                            />
                        </div>

                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="house_rules_cancellation_policy">
                                Cancellation policy
                            </Label>
                            <textarea
                                id="house_rules_cancellation_policy"
                                name="house_rules[cancellation_policy]"
                                rows={3}
                                defaultValue={
                                    property?.house_rules
                                        ?.cancellation_policy ?? ''
                                }
                                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            />
                            <InputError
                                message={
                                    errors['house_rules.cancellation_policy']
                                }
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="house_rules_damage_deposit">
                                Damage deposit
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
                                Age restriction
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
                            <Label htmlFor="notes">Notes</Label>
                            <textarea
                                id="notes"
                                name="notes"
                                rows={3}
                                defaultValue={property?.notes ?? ''}
                                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            />
                            <InputError message={errors.notes} />
                        </div>

                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                name="house_rules[smoking_allowed]"
                                value="1"
                                defaultChecked={
                                    property?.house_rules?.smoking_allowed ??
                                    false
                                }
                                className="size-4"
                            />
                            Smoking allowed
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
                            Pets allowed
                        </label>
                    </section>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>{submitLabel}</Button>
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
                    </div>
                </>
            )}
        </Form>
    );
}
