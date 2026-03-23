<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Amenity\StoreAmenityRequest;
use App\Http\Requests\Amenity\UpdateAmenityRequest;
use App\Models\Amenity;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AmenityController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', Amenity::class);

        return Inertia::render('admin/amenities/index', [
            'amenities' => Amenity::query()
                ->orderBy('name')
                ->get()
                ->map(fn(Amenity $amenity): array => [
                    'id' => $amenity->id,
                    'name' => $amenity->name,
                    'icon' => $amenity->icon,
                    'description' => $amenity->description,
                    'is_active' => $amenity->is_active,
                ])
                ->values(),
        ]);
    }

    public function store(StoreAmenityRequest $request): RedirectResponse
    {
        Amenity::query()->create($request->validated());

        return back()->with('success', __('ui.amenities.messages.created'));
    }

    public function update(UpdateAmenityRequest $request, Amenity $amenity): RedirectResponse
    {
        $amenity->update($request->validated());

        return back()->with('success', __('ui.amenities.messages.updated'));
    }

    public function destroy(Amenity $amenity): RedirectResponse
    {
        $this->authorize('delete', $amenity);

        $amenity->delete();

        return back()->with('success', __('ui.amenities.messages.deleted'));
    }
}
