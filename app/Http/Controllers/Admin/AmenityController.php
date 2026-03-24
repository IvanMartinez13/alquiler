<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Amenity\StoreAmenityRequest;
use App\Http\Requests\Amenity\UpdateAmenityRequest;
use App\Models\Amenity;
use App\Services\TranslationService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AmenityController extends Controller
{
    public function __construct(private readonly TranslationService $translationService) {}

    public function index(): Response
    {
        $this->authorize('viewAny', Amenity::class);

        $locale = app()->getLocale();

        return Inertia::render('admin/amenities/index', [
            'amenities' => Amenity::query()
                ->orderBy('code')
                ->get()
                ->map(fn(Amenity $amenity): array => [
                    'id' => $amenity->id,
                    'name' => $amenity->getLocalizedName($locale),
                    'icon' => $amenity->icon,
                    'description' => $amenity->getLocalizedDescription($locale),
                    'is_active' => $amenity->is_active,
                ])
                ->values(),
        ]);
    }

    public function store(StoreAmenityRequest $request): RedirectResponse
    {
        $sourceLocale = $request->input('source_locale', $request->user()?->locale ?? app()->getLocale());
        $validated = $request->validated();

        Amenity::query()->create(
            [
                ...array_diff_key($validated, array_flip(['name', 'description', 'source_locale'])),
                'name' => $this->translationService->translateToLocales(
                    text: (string) ($validated['name'] ?? ''),
                    sourceLocale: $sourceLocale,
                ),
                'description' => filled($validated['description'] ?? null)
                    ? $this->translationService->translateToLocales(
                        text: (string) $validated['description'],
                        sourceLocale: $sourceLocale,
                    )
                    : null,
            ],
        );

        return back()->with('success', __('ui.amenities.messages.created'));
    }

    public function update(UpdateAmenityRequest $request, Amenity $amenity): RedirectResponse
    {
        $sourceLocale = $request->input('source_locale', $request->user()?->locale ?? app()->getLocale());
        $validated = $request->validated();

        $amenity->update(
            [
                ...array_diff_key($validated, array_flip(['name', 'description', 'source_locale'])),
                'code' => $amenity->code,
                'name' => $this->translationService->translateToLocales(
                    text: (string) ($validated['name'] ?? ''),
                    sourceLocale: $sourceLocale,
                ),
                'description' => filled($validated['description'] ?? null)
                    ? $this->translationService->translateToLocales(
                        text: (string) $validated['description'],
                        sourceLocale: $sourceLocale,
                    )
                    : null,
            ],
        );

        return back()->with('success', __('ui.amenities.messages.updated'));
    }

    public function destroy(Amenity $amenity): RedirectResponse
    {
        $this->authorize('delete', $amenity);

        $amenity->delete();

        return back()->with('success', __('ui.amenities.messages.deleted'));
    }
}
