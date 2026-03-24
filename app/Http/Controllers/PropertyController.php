<?php

namespace App\Http\Controllers;

use App\Http\Requests\Property\StorePropertyRequest;
use App\Http\Requests\Property\UpdatePropertyRequest;
use App\Models\Amenity;
use App\Models\Property;
use App\Services\PropertyService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PropertyController extends Controller
{
    public function __construct(private readonly PropertyService $propertyService) {}

    public function index(): Response
    {
        $this->authorize('viewAny', Property::class);

        $ownerId = request()->user()->getAuthIdentifier();

        $properties = Property::query()
            ->ownedBy($ownerId)
            ->with(['amenities', 'images'])
            ->latest()
            ->paginate(9)
            ->withQueryString()
            ->through(fn(Property $property): array => [
                'id' => $property->id,
                'title' => $property->title,
                'slug' => $property->slug,
                'city' => $property->city,
                'country' => $property->country,
                'type' => $property->type,
                'status' => $property->status->value,
                'max_guests' => $property->max_guests,
                'cover_image_url' => $property->images->first()
                    ? asset('storage/' . $property->images->first()->path)
                    : null,
                'amenities_count' => $property->amenities->count(),
            ]);

        return Inertia::render('properties/index', [
            'properties' => $properties,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Property::class);

        $locale = app()->getLocale();

        return Inertia::render('properties/create', [
            'amenities' => Amenity::query()
                ->where('is_active', true)
                ->orderBy('code')
                ->get(['id', 'name', 'icon'])
                ->map(fn(Amenity $amenity): array => [
                    'id' => $amenity->id,
                    'name' => $amenity->getLocalizedName($locale),
                    'icon' => $amenity->icon,
                ])
                ->values()
                ->all(),
        ]);
    }

    public function store(StorePropertyRequest $request): RedirectResponse
    {
        $property = $this->propertyService->createForOwner(
            ownerId: $request->user()->id,
            payload: $request->validated(),
        );

        return redirect()
            ->route('properties.edit', $property)
            ->with('success', __('ui.properties.messages.created'));
    }

    public function show(Property $property): Response
    {
        $this->authorize('view', $property);

        $property->load(['amenities', 'images']);
        $locale = app()->getLocale();

        return Inertia::render('properties/show', [
            'property' => [
                'id' => $property->id,
                'title' => $property->title,
                'slug' => $property->slug,
                'description' => $property->description,
                'address' => $property->address,
                'city' => $property->city,
                'country' => $property->country,
                'latitude' => $property->latitude,
                'longitude' => $property->longitude,
                'type' => $property->type,
                'max_guests' => $property->max_guests,
                'bedrooms' => $property->bedrooms,
                'beds' => $property->beds,
                'bathrooms' => $property->bathrooms,
                'check_in_time' => $property->check_in_time,
                'check_out_time' => $property->check_out_time,
                'notes' => $property->notes,
                'house_rules' => $property->house_rules,
                'status' => $property->status->value,
                'amenities' => $property->amenities->map(fn($amenity): array => [
                    'id' => $amenity->id,
                    'name' => $amenity->getLocalizedName($locale),
                    'icon' => $amenity->icon,
                ])->values(),
                'images' => $property->images->map(fn($image): array => [
                    'id' => $image->id,
                    'url' => asset('storage/' . $image->path),
                    'alt' => $image->alt,
                    'sort_order' => $image->sort_order,
                ])->values(),
            ],
        ]);
    }

    public function edit(Property $property): Response
    {
        $this->authorize('update', $property);

        $property->load(['amenities', 'images']);
        $locale = app()->getLocale();

        return Inertia::render('properties/edit', [
            'property' => [
                'id' => $property->id,
                'title' => $property->title,
                'slug' => $property->slug,
                'description' => $property->description,
                'address' => $property->address,
                'city' => $property->city,
                'country' => $property->country,
                'latitude' => $property->latitude,
                'longitude' => $property->longitude,
                'type' => $property->type,
                'max_guests' => $property->max_guests,
                'bedrooms' => $property->bedrooms,
                'beds' => $property->beds,
                'bathrooms' => $property->bathrooms,
                'check_in_time' => $property->check_in_time,
                'check_out_time' => $property->check_out_time,
                'notes' => $property->notes,
                'house_rules' => $property->house_rules,
                'status' => $property->status->value,
                'amenity_ids' => $property->amenities->pluck('id')->all(),
                'images' => $property->images->map(fn($image): array => [
                    'id' => $image->id,
                    'url' => asset('storage/' . $image->path),
                    'alt' => $image->alt,
                    'sort_order' => $image->sort_order,
                ])->values(),
            ],
            'amenities' => Amenity::query()
                ->where('is_active', true)
                ->orderBy('code')
                ->get(['id', 'name', 'icon'])
                ->map(fn(Amenity $amenity): array => [
                    'id' => $amenity->id,
                    'name' => $amenity->getLocalizedName($locale),
                    'icon' => $amenity->icon,
                ])
                ->values()
                ->all(),
        ]);
    }

    public function update(UpdatePropertyRequest $request, Property $property): RedirectResponse
    {
        $this->propertyService->update($property, $request->validated());

        return back()->with('success', __('ui.properties.messages.updated'));
    }

    public function destroy(Property $property): RedirectResponse
    {
        $this->authorize('delete', $property);

        $this->propertyService->delete($property);

        return redirect()
            ->route('properties.index')
            ->with('success', __('ui.properties.messages.deleted'));
    }
}
