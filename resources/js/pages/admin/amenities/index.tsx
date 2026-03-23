import { Form, Head, router } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Amenity = {
    id: number;
    name: string;
    icon?: string | null;
    description?: string | null;
    is_active: boolean;
};

type Props = {
    amenities: Amenity[];
};

export default function AmenitiesIndex({ amenities }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin amenities', href: '/admin/amenities' },
    ];

    function destroyAmenity(id: number) {
        if (!window.confirm('Delete this amenity?')) {
            return;
        }

        router.delete(`/admin/amenities/${id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin amenities" />

            <div className="mx-auto max-w-5xl space-y-6 p-4">
                <div>
                    <h1 className="text-2xl font-semibold">
                        Amenities catalog
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Centralized list used by property forms.
                    </p>
                </div>

                <section className="rounded-xl border border-border p-4">
                    <h2 className="mb-4 font-semibold">Create amenity</h2>
                    <Form
                        action="/admin/amenities"
                        method="post"
                        className="grid gap-3 md:grid-cols-2"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" name="name" required />
                                    <InputError message={errors.name} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="icon">Icon</Label>
                                    <Input
                                        id="icon"
                                        name="icon"
                                        placeholder="wifi"
                                    />
                                    <InputError message={errors.icon} />
                                </div>
                                <div className="grid gap-2 md:col-span-2">
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Input
                                        id="description"
                                        name="description"
                                    />
                                    <InputError message={errors.description} />
                                </div>
                                <label className="flex items-center gap-2 text-sm md:col-span-2">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        value="1"
                                        defaultChecked
                                        className="size-4"
                                    />
                                    Active amenity
                                </label>
                                <div>
                                    <Button disabled={processing}>
                                        Create
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </section>

                <section className="space-y-3">
                    {amenities.map((amenity) => (
                        <article
                            key={amenity.id}
                            className="rounded-xl border border-border p-4"
                        >
                            <Form
                                action={`/admin/amenities/${amenity.id}`}
                                method="put"
                                className="grid gap-3 md:grid-cols-2"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor={`name-${amenity.id}`}
                                            >
                                                Name
                                            </Label>
                                            <Input
                                                id={`name-${amenity.id}`}
                                                name="name"
                                                defaultValue={amenity.name}
                                                required
                                            />
                                            <InputError message={errors.name} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor={`icon-${amenity.id}`}
                                            >
                                                Icon
                                            </Label>
                                            <Input
                                                id={`icon-${amenity.id}`}
                                                name="icon"
                                                defaultValue={
                                                    amenity.icon ?? ''
                                                }
                                            />
                                            <InputError message={errors.icon} />
                                        </div>
                                        <div className="grid gap-2 md:col-span-2">
                                            <Label
                                                htmlFor={`description-${amenity.id}`}
                                            >
                                                Description
                                            </Label>
                                            <Input
                                                id={`description-${amenity.id}`}
                                                name="description"
                                                defaultValue={
                                                    amenity.description ?? ''
                                                }
                                            />
                                            <InputError
                                                message={errors.description}
                                            />
                                        </div>
                                        <label className="flex items-center gap-2 text-sm md:col-span-2">
                                            <input
                                                type="checkbox"
                                                name="is_active"
                                                value="1"
                                                defaultChecked={
                                                    amenity.is_active
                                                }
                                                className="size-4"
                                            />
                                            Active amenity
                                        </label>
                                        <div className="flex gap-2">
                                            <Button disabled={processing}>
                                                Save
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                onClick={() =>
                                                    destroyAmenity(amenity.id)
                                                }
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </article>
                    ))}
                </section>
            </div>
        </AppLayout>
    );
}
