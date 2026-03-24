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
                    targetLocales: $this->targetLocales(),
                ),
                'description' => filled($validated['description'] ?? null)
                    ? $this->translationService->translateToLocales(
                        text: (string) $validated['description'],
                        sourceLocale: $sourceLocale,
                        targetLocales: $this->targetLocales(),
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
        $translatedUpdates = [];

        $nextName = (string) ($validated['name'] ?? '');

        if (! $this->isSameText($nextName, $amenity->getLocalizedName($sourceLocale))) {
            $translatedUpdates['name'] = $this->translationService->translateToLocales(
                text: $nextName,
                sourceLocale: $sourceLocale,
                targetLocales: $this->targetLocales(),
            );
        }

        $nextDescription = (string) ($validated['description'] ?? '');
        $currentDescription = $amenity->getLocalizedDescription($sourceLocale) ?? '';

        if (! $this->isSameText($nextDescription, $currentDescription)) {
            $translatedUpdates['description'] = trim($nextDescription) !== ''
                ? $this->translationService->translateToLocales(
                    text: $nextDescription,
                    sourceLocale: $sourceLocale,
                    targetLocales: $this->targetLocales(),
                )
                : null;
        }

        $amenity->update(
            [
                ...array_diff_key($validated, array_flip(['name', 'description', 'source_locale'])),
                'code' => $amenity->code,
                ...$translatedUpdates,
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

    /**
     * @return array<int, string>
     */
    private function targetLocales(): array
    {
        return ['es', 'en', 'de'];
    }

    private function isSameText(string $left, string $right): bool
    {
        return trim($left) === trim($right);
    }
}
