import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Pencil, Plus, Search, Sparkles, Trash2 } from 'lucide-react';
import type { FormEvent } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/hooks/use-translations';
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

const PAGE_SIZE = 9;

export default function AmenitiesIndex({ amenities }: Props) {
    const { t } = useTranslations();
    const { locale } = usePage<{ locale: string }>().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [revealedCards, setRevealedCards] = useState<Record<number, boolean>>(
        {},
    );
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const revealObserverRef = useRef<IntersectionObserver | null>(null);
    const pendingRevealElementsRef = useRef<HTMLElement[]>([]);

    const form = useForm({
        name: '',
        icon: '',
        description: '',
        is_active: true,
        source_locale: locale,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('amenities.admin.breadcrumb', 'Admin amenities'), href: '/admin/amenities' },
    ];

    const modalTitle = useMemo(
        () =>
            editingAmenity
                ? t('amenities.admin.modal_edit_title', 'Edit amenity')
                : t('amenities.admin.modal_create_title', 'Create amenity'),
        [editingAmenity, t],
    );

    const filteredAmenities = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        if (!query) {
            return amenities;
        }

        return amenities.filter((amenity) => {
            const haystack = [
                amenity.name,
                amenity.icon ?? '',
                amenity.description ?? '',
                amenity.is_active ? 'active' : 'inactive',
                amenity.is_active
                    ? t('amenities.admin.active', 'Active')
                    : t('amenities.admin.inactive', 'Inactive'),
            ]
                .join(' ')
                .toLowerCase();

            return haystack.includes(query);
        });
    }, [amenities, searchTerm, t]);

    const modalIconClass = form.data.icon.trim();
    const hasModalFontAwesomeIcon =
        /\bfa[srlbd]?\b/.test(modalIconClass) &&
        /\bfa-[a-z0-9-]+\b/i.test(modalIconClass);
    const modalFallbackLabel = (form.data.name.trim() || 'AM')
        .slice(0, 2)
        .toUpperCase();
    const visibleAmenities = useMemo(
        () => filteredAmenities.slice(0, visibleCount),
        [filteredAmenities, visibleCount],
    );
    const hasMoreAmenities = visibleCount < filteredAmenities.length;

    const registerCard = useCallback((id: number) => {
        return (element: HTMLElement | null) => {
            if (!element) {
                return;
            }

            element.dataset.amenityId = String(id);

            if (revealObserverRef.current) {
                revealObserverRef.current.observe(element);

                return;
            }

            pendingRevealElementsRef.current.push(element);
        };
    }, []);

    useEffect(() => {
        revealObserverRef.current = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    const idText = (entry.target as HTMLElement).dataset.amenityId;
                    const id = Number(idText);

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
            { threshold: 0.05, rootMargin: '0px 0px -8% 0px' },
        );

        pendingRevealElementsRef.current.forEach((element) => {
            revealObserverRef.current?.observe(element);
        });
        pendingRevealElementsRef.current = [];

        return () => {
            revealObserverRef.current?.disconnect();
            revealObserverRef.current = null;
            pendingRevealElementsRef.current = [];
        };
    }, []);

    useEffect(() => {
        const node = loadMoreRef.current;

        if (!node || !hasMoreAmenities) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (!entries[0]?.isIntersecting) {
                    return;
                }

                setVisibleCount((previous) =>
                    Math.min(previous + PAGE_SIZE, filteredAmenities.length),
                );
            },
            { threshold: 0.15, rootMargin: '0px 0px 240px 0px' },
        );

        observer.observe(node);

        return () => observer.disconnect();
    }, [filteredAmenities.length, hasMoreAmenities]);

    function openCreateModal() {
        setEditingAmenity(null);
        form.setData({
            name: '',
            icon: '',
            description: '',
            is_active: true,
            source_locale: locale,
        });
        form.clearErrors();
        setIsModalOpen(true);
    }

    function openEditModal(amenity: Amenity) {
        setEditingAmenity(amenity);
        form.setData({
            name: amenity.name,
            icon: amenity.icon ?? '',
            description: amenity.description ?? '',
            is_active: amenity.is_active,
            source_locale: locale,
        });
        form.clearErrors();
        setIsModalOpen(true);
    }

    function closeModal(open: boolean) {
        setIsModalOpen(open);

        if (!open) {
            form.clearErrors();
            setEditingAmenity(null);
        }
    }

    function submitAmenity(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const options = {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setIsModalOpen(false);
                setEditingAmenity(null);
                form.reset();
                form.setData('source_locale', locale);
            },
            onError: () => setIsModalOpen(true),
        };

        if (editingAmenity) {
            form.put(`/admin/amenities/${editingAmenity.id}`, options);

            return;
        }

        form.post('/admin/amenities', options);
    }

    async function destroyAmenity(amenity: Amenity) {
        const result = await Swal.fire({
            title: t('amenities.admin.delete_confirm_title', 'Delete ":name"?').replace(
                ':name',
                amenity.name,
            ),
            text: t(
                'amenities.admin.delete_confirm_text',
                'This action cannot be undone.',
            ),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: t('amenities.admin.delete_confirm_action', 'Yes, delete'),
            cancelButtonText: t('common.cancel', 'Cancel'),
            confirmButtonColor: '#dc2626',
        });

        if (!result.isConfirmed) {
            return;
        }

        router.delete(`/admin/amenities/${amenity.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                void Swal.fire({
                    title: t('amenities.admin.deleted_title', 'Deleted'),
                    text: t(
                        'amenities.admin.deleted_text',
                        'Amenity removed successfully.',
                    ),
                    icon: 'success',
                    timer: 1400,
                    showConfirmButton: false,
                });
            },
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('amenities.admin.head_title', 'Admin amenities')} />

            <div className="mx-auto max-w-5xl space-y-6 p-4">
                <div>
                    <h1 className="text-2xl font-semibold">
                        {t('amenities.admin.title', 'Amenities catalog')}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {t(
                            'amenities.admin.subtitle',
                            'Centralized list used by property forms.',
                        )}
                    </p>
                </div>

                <section className="rounded-2xl border border-border/70 bg-card/60 p-4 shadow-sm backdrop-blur sm:p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-medium">
                                {t('amenities.admin.search_title', 'Search amenities')}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {t(
                                    'amenities.admin.search_description',
                                    'Filter by name, description, icon or status. Search always checks all amenities, not only visible cards.',
                                )}
                            </p>
                        </div>
                        <Badge variant="outline" className="w-fit">
                            {filteredAmenities.length} / {amenities.length}
                        </Badge>
                    </div>

                    <div className="relative mt-4">
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={searchTerm}
                            onChange={(event) => {
                                setSearchTerm(event.target.value);
                                setVisibleCount(PAGE_SIZE);
                            }}
                            placeholder={t(
                                'amenities.admin.search_placeholder',
                                'Search: wifi, active, fas fa-wheelchair...',
                            )}
                            className="pl-9"
                        />
                    </div>
                </section>

                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="group flex min-h-52 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/20 p-5 text-center transition hover:border-primary/60 hover:bg-primary/5"
                    >
                        <span className="rounded-full bg-primary/10 p-3 text-primary transition group-hover:scale-110">
                            <Plus className="size-6" />
                        </span>
                        <h2 className="font-semibold">
                            {t('amenities.admin.create_card_title', 'Create amenity')}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {t(
                                'amenities.admin.create_card_description',
                                'Add a new option to the property amenities catalog.',
                            )}
                        </p>
                    </button>

                    {visibleAmenities.map((amenity) => {
                        const iconClass = amenity.icon?.trim() ?? '';
                        const hasFontAwesomeIcon =
                            /\bfa[srlbd]?\b/.test(iconClass) &&
                            /\bfa-[a-z0-9-]+\b/i.test(iconClass);
                        const fallbackLabel = amenity.name
                            .trim()
                            .slice(0, 2)
                            .toUpperCase();

                        return (
                            <article
                                key={amenity.id}
                                ref={registerCard(amenity.id)}
                                className={`flex min-h-52 flex-col rounded-xl border border-border bg-card p-5 transition-all duration-500 will-change-transform ${
                                    revealedCards[amenity.id]
                                        ? 'translate-y-0 scale-100 opacity-100'
                                        : 'translate-y-6 scale-[0.98] opacity-0'
                                }`}
                            >
                                <div className="mb-4 flex items-start justify-between gap-3">
                                    <div className="grid gap-3">
                                        <span className="inline-flex size-12 items-center justify-center rounded-lg bg-muted font-semibold uppercase">
                                            {hasFontAwesomeIcon ? (
                                                <i
                                                    className={`${iconClass} text-lg`}
                                                    aria-hidden="true"
                                                />
                                            ) : (
                                                fallbackLabel
                                            )}
                                        </span>
                                        <div>
                                            <h3 className="font-semibold leading-tight">
                                                {amenity.name}
                                            </h3>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {t('amenities.admin.icon_label', 'Icon')}:{' '}
                                                {amenity.icon ??
                                                    t('amenities.admin.not_set', 'not set')}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge
                                        variant={
                                            amenity.is_active
                                                ? 'default'
                                                : 'secondary'
                                        }
                                    >
                                        {amenity.is_active
                                            ? t('amenities.admin.active', 'Active')
                                            : t('amenities.admin.inactive', 'Inactive')}
                                    </Badge>
                                </div>

                                <p className="line-clamp-4 text-sm text-muted-foreground">
                                    {amenity.description?.trim() ||
                                        t(
                                            'amenities.admin.no_description',
                                            'No description provided.',
                                        )}
                                </p>

                                <div className="mt-auto flex gap-2 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => openEditModal(amenity)}
                                        className="flex-1"
                                    >
                                        <Pencil className="mr-2 size-4" />
                                        {t('amenities.admin.edit_action', 'Edit')}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() => destroyAmenity(amenity)}
                                        className="flex-1"
                                    >
                                        <Trash2 className="mr-2 size-4" />
                                        {t('amenities.admin.delete_action', 'Delete')}
                                    </Button>
                                </div>
                            </article>
                        );
                    })}

                    {filteredAmenities.length === 0 && (
                        <article className="col-span-full rounded-xl border border-dashed border-border p-8 text-center">
                            <p className="font-medium">
                                {t('amenities.admin.empty_title', 'No amenities found')}
                            </p>
                            <p className="mt-2 text-sm text-muted-foreground">
                                {t(
                                    'amenities.admin.empty_description',
                                    'Try another search term or clear the filter.',
                                )}
                            </p>
                        </article>
                    )}
                </section>

                {hasMoreAmenities && filteredAmenities.length > 0 && (
                    <div ref={loadMoreRef} className="py-2 text-center">
                        <p className="text-xs text-muted-foreground">
                            {t(
                                'amenities.admin.loading_more',
                                'Loading more amenities...',
                            )}
                        </p>
                    </div>
                )}

                <Dialog open={isModalOpen} onOpenChange={closeModal}>
                    <DialogContent className="overflow-hidden border-border/70 p-0 sm:max-w-2xl data-[state=open]:duration-300 data-[state=open]:fade-in-0">
                        <DialogHeader className="border-b bg-linear-to-r from-primary/10 via-primary/5 to-transparent px-6 py-5">
                            <div className="flex items-center gap-3">
                                <span className="inline-flex size-9 items-center justify-center rounded-full bg-primary/15 text-primary">
                                    <Sparkles className="size-4" />
                                </span>
                                <div>
                                    <DialogTitle>{modalTitle}</DialogTitle>
                                    <DialogDescription>
                                        {editingAmenity
                                            ? t(
                                                'amenities.admin.modal_edit_description',
                                                'Update the amenity information.',
                                            )
                                            : t(
                                                'amenities.admin.modal_create_description',
                                                'Create a new amenity for your catalog.',
                                            )}
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <form
                            onSubmit={submitAmenity}
                            className="grid gap-6 p-6 md:grid-cols-[1fr_220px]"
                        >
                            <input
                                type="hidden"
                                name="source_locale"
                                value={form.data.source_locale}
                            />

                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">
                                        {t('common.name', 'Name')}
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        required
                                        value={form.data.name}
                                        onChange={(event) =>
                                            form.setData('name', event.target.value)
                                        }
                                    />
                                    <InputError message={form.errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="icon">
                                        {t(
                                            'amenities.admin.fontawesome_class',
                                            'Font Awesome class',
                                        )}
                                    </Label>
                                    <Input
                                        id="icon"
                                        name="icon"
                                        placeholder="fas fa-wheelchair"
                                        value={form.data.icon}
                                        onChange={(event) =>
                                            form.setData('icon', event.target.value)
                                        }
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {t(
                                            'amenities.admin.icon_example',
                                            'Example: fas fa-wifi, far fa-star, fas fa-wheelchair',
                                        )}
                                    </p>
                                    <InputError message={form.errors.icon} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="description">
                                        {t('amenities.admin.description_label', 'Description')}
                                    </Label>
                                    <Input
                                        id="description"
                                        name="description"
                                        value={form.data.description}
                                        onChange={(event) =>
                                            form.setData(
                                                'description',
                                                event.target.value,
                                            )
                                        }
                                    />
                                    <InputError
                                        message={form.errors.description}
                                    />
                                </div>

                                <label className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1.5 text-sm">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={form.data.is_active}
                                        onChange={(event) =>
                                            form.setData(
                                                'is_active',
                                                event.target.checked,
                                            )
                                        }
                                        className="size-4"
                                    />
                                    {t('amenities.admin.active_amenity', 'Active amenity')}
                                </label>

                                <div className="flex flex-wrap gap-2 pt-2">
                                    <Button
                                        type="submit"
                                        disabled={form.processing}
                                        className="min-w-36"
                                    >
                                        {editingAmenity
                                            ? t('amenities.admin.save_changes', 'Save changes')
                                            : t('amenities.admin.create_action', 'Create amenity')}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => closeModal(false)}
                                        className="min-w-28"
                                    >
                                        {t('common.cancel', 'Cancel')}
                                    </Button>
                                </div>
                            </div>

                            <aside className="flex h-full flex-col rounded-xl border border-border/70 bg-muted/20 p-4">
                                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    {t('amenities.admin.live_preview', 'Live preview')}
                                </p>
                                <div className="mt-4 flex flex-1 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border/80 bg-background/70 p-4 text-center">
                                    <span className="inline-flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        {hasModalFontAwesomeIcon ? (
                                            <i
                                                className={`${modalIconClass} text-xl`}
                                                aria-hidden="true"
                                            />
                                        ) : (
                                            <span className="font-semibold text-base text-foreground">
                                                {modalFallbackLabel}
                                            </span>
                                        )}
                                    </span>
                                    <p className="max-w-45 text-sm font-medium leading-tight">
                                        {form.data.name.trim() ||
                                            t(
                                                'amenities.admin.preview_name',
                                                'Amenity name preview',
                                            )}
                                    </p>
                                    <Badge
                                        variant={
                                            form.data.is_active
                                                ? 'default'
                                                : 'secondary'
                                        }
                                    >
                                        {form.data.is_active
                                            ? t('amenities.admin.active', 'Active')
                                            : t('amenities.admin.inactive', 'Inactive')}
                                    </Badge>
                                </div>
                                <p className="mt-3 text-xs text-muted-foreground">
                                    {t(
                                        'amenities.admin.preview_hint',
                                        'Use valid Font Awesome 5 classes to render the exact icon.',
                                    )}
                                </p>
                            </aside>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
