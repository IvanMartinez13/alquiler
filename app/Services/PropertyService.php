<?php

namespace App\Services;

use App\Models\Property;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PropertyService
{
    public function __construct(
        private readonly TranslationService $translationService,
        private readonly ImageOptimizationService $imageOptimizationService,
    ) {}

    /**
     * @param  array<string, mixed>  $payload
     */
    public function createForOwner(int $ownerId, array $payload): Property
    {
        return DB::transaction(function () use ($ownerId, $payload): Property {
            $sourceLocale = $this->extractSourceLocale($payload);

            $property = Property::query()->create([
                ...Arr::except($payload, ['amenities', 'images', 'source_locale']),
                'user_id' => $ownerId,
                ...$this->buildTranslatedAttributes($payload, $sourceLocale),
            ]);

            $this->syncAmenities($property, $payload);
            $createdImageIds = $this->storeNewImages($property, $payload, $sourceLocale);
            $this->applyFavoriteImageSelection($property, $payload, $createdImageIds);

            return $property->load(['amenities', 'images']);
        });
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    public function update(Property $property, array $payload): Property
    {
        return DB::transaction(function () use ($property, $payload): Property {
            $sourceLocale = $this->extractSourceLocale($payload);
            $currentLocalizedTitle = $property->getLocalizedTitle($sourceLocale);

            $property->fill([
                ...Arr::except($payload, ['amenities', 'images', 'remove_image_ids', 'image_order', 'source_locale']),
                ...$this->buildTranslatedAttributes($payload, $sourceLocale, $property),
            ]);
            $property->save();

            $this->syncAmenities($property, $payload);
            $this->removeImages($property, $payload);
            $createdImageIds = $this->storeNewImages($property, $payload, $sourceLocale);
            $this->syncExistingImageAltTranslations(
                $property,
                $payload,
                $sourceLocale,
                $currentLocalizedTitle,
            );
            $this->sortImages($property, $payload);
            $this->applyFavoriteImageSelection($property, $payload, $createdImageIds);

            return $property->load(['amenities', 'images']);
        });
    }

    public function delete(Property $property): void
    {
        DB::transaction(function () use ($property): void {
            $property->images()->each(function ($image): void {
                Storage::disk('public')->delete($image->path);
            });

            $property->amenities()->detach();
            $property->delete();
        });
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function syncAmenities(Property $property, array $payload): void
    {
        if (! array_key_exists('amenities', $payload)) {
            return;
        }

        $property->amenities()->sync($payload['amenities'] ?? []);
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function storeNewImages(Property $property, array $payload, string $sourceLocale): array
    {
        /** @var array<int, UploadedFile> $images */
        $images = $payload['images'] ?? [];

        if ($images === []) {
            return [];
        }

        $maxSortOrder = (int) $property->images()->max('sort_order');
        $altText = (string) ($payload['title'] ?? $property->title);
        $altTranslations = $this->translationService->translateToLocales(
            text: $altText,
            sourceLocale: $sourceLocale,
            targetLocales: $this->targetLocales(),
        );

        $createdImageIds = [];

        foreach ($images as $index => $image) {
            $path = $this->imageOptimizationService->storeAsWebp(
                image: $image,
                directory: sprintf('properties/%d', $property->id),
            );

            $createdImage = $property->images()->create([
                'path' => $path,
                'alt' => $altText,
                'alt_translations' => $altTranslations,
                'sort_order' => $maxSortOrder + $index + 1,
            ]);

            $createdImageIds[] = $createdImage->id;
        }

        return $createdImageIds;
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function removeImages(Property $property, array $payload): void
    {
        $ids = $payload['remove_image_ids'] ?? [];

        if ($ids === []) {
            return;
        }

        $property->images()
            ->whereIn('id', $ids)
            ->get()
            ->each(function ($image): void {
                Storage::disk('public')->delete($image->path);
                $image->delete();
            });
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function sortImages(Property $property, array $payload): void
    {
        $orderedIds = $payload['image_order'] ?? [];

        if ($orderedIds === []) {
            return;
        }

        foreach ($orderedIds as $index => $id) {
            $property->images()->where('id', $id)->update(['sort_order' => $index + 1]);
        }
    }

    /**
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>
     */
    private function buildTranslatedAttributes(
        array $payload,
        string $sourceLocale,
        ?Property $property = null,
    ): array
    {
        $houseRules = $payload['house_rules'] ?? [];
        $targetLocales = $this->targetLocales();
        $isUpdate = $property instanceof Property;
        $translatedAttributes = [];

        $textFields = [
            [
                'key' => 'title',
                'translation_key' => 'title_translations',
                'current' => $property?->getLocalizedTitle($sourceLocale) ?? '',
            ],
            [
                'key' => 'description',
                'translation_key' => 'description_translations',
                'current' => $property?->getLocalizedDescription($sourceLocale) ?? '',
            ],
            [
                'key' => 'address',
                'translation_key' => 'address_translations',
                'current' => $property?->getLocalizedAddress($sourceLocale) ?? '',
            ],
            [
                'key' => 'city',
                'translation_key' => 'city_translations',
                'current' => $property?->getLocalizedCity($sourceLocale) ?? '',
            ],
            [
                'key' => 'country',
                'translation_key' => 'country_translations',
                'current' => $property?->getLocalizedCountry($sourceLocale) ?? '',
            ],
        ];

        foreach ($textFields as $field) {
            $key = (string) $field['key'];
            $translationKey = (string) $field['translation_key'];
            $newValue = (string) ($payload[$key] ?? '');
            $currentValue = (string) $field['current'];

            if ($isUpdate && $this->isSameText($newValue, $currentValue)) {
                continue;
            }

            if (in_array($key, ['city', 'country'], true)) {
                $translatedAttributes[$translationKey] = $this->mirrorAcrossLocales(
                    text: $newValue,
                    sourceLocale: $sourceLocale,
                    targetLocales: $targetLocales,
                );

                continue;
            }

            $translatedAttributes[$translationKey] = $this->translationService->translateToLocales(
                text: $newValue,
                sourceLocale: $sourceLocale,
                targetLocales: $targetLocales,
            );
        }

        $notesValue = (string) ($payload['notes'] ?? '');
        $currentNotes = $property?->getLocalizedNotes($sourceLocale) ?? '';

        if (! ($isUpdate && $this->isSameText($notesValue, $currentNotes))) {
            $translatedAttributes['notes_translations'] = trim($notesValue) !== ''
                ? $this->translationService->translateToLocales(
                    text: $notesValue,
                    sourceLocale: $sourceLocale,
                    targetLocales: $targetLocales,
                )
                : null;
        }

        $existingHouseRulesTranslations = is_array($property?->house_rules_translations)
            ? $property->house_rules_translations
            : [];
        $nextHouseRulesTranslations = $existingHouseRulesTranslations;
        $currentLocalizedHouseRules = is_array($property?->getLocalizedHouseRules($sourceLocale))
            ? $property->getLocalizedHouseRules($sourceLocale)
            : [];
        $houseRulesChanged = ! $isUpdate;

        if (is_array($houseRules)) {
            foreach ($houseRules as $key => $value) {
                if (! is_string($key) || ! is_string($value)) {
                    continue;
                }

                $currentValue = is_string($currentLocalizedHouseRules[$key] ?? null)
                    ? (string) $currentLocalizedHouseRules[$key]
                    : '';

                if ($isUpdate && $this->isSameText($value, $currentValue)) {
                    continue;
                }

                $houseRulesChanged = true;
                $trimmedValue = trim($value);

                if ($trimmedValue === '') {
                    unset($nextHouseRulesTranslations[$key]);

                    continue;
                }

                $nextHouseRulesTranslations[$key] = $this->translationService->translateToLocales(
                        text: $trimmedValue,
                        sourceLocale: $sourceLocale,
                        targetLocales: $targetLocales,
                    );
            }
        }

        if ($houseRulesChanged) {
            $translatedAttributes['house_rules_translations'] =
                $nextHouseRulesTranslations !== [] ? $nextHouseRulesTranslations : null;
        }

        return $translatedAttributes;
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function syncExistingImageAltTranslations(
        Property $property,
        array $payload,
        string $sourceLocale,
        string $currentLocalizedTitle,
    ): void
    {
        if (! array_key_exists('title', $payload)) {
            return;
        }

        $altText = (string) $payload['title'];

        if (trim($altText) === '' || $this->isSameText($altText, $currentLocalizedTitle)) {
            return;
        }

        $altTranslations = $this->translationService->translateToLocales(
            text: $altText,
            sourceLocale: $sourceLocale,
            targetLocales: $this->targetLocales(),
        );

        $property->images()->update([
            'alt' => $altText,
            'alt_translations' => $altTranslations,
        ]);
    }

    private function isSameText(string $left, string $right): bool
    {
        return trim($left) === trim($right);
    }

    /**
     * @return array<int, string>
     */
    private function targetLocales(): array
    {
        return ['es', 'en', 'de'];
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function extractSourceLocale(array $payload): string
    {
        return (string) ($payload['source_locale'] ?? app()->getLocale());
    }

    /**
     * @param  array<string, mixed>  $payload
     * @param  array<int, int>  $createdImageIds
     */
    private function applyFavoriteImageSelection(Property $property, array $payload, array $createdImageIds): void
    {
        $favoriteImageId = isset($payload['favorite_image_id'])
            ? (int) $payload['favorite_image_id']
            : null;

        if ($favoriteImageId !== null && $favoriteImageId > 0) {
            $this->setFavoriteImage($property, $favoriteImageId);

            return;
        }

        if (! isset($payload['favorite_upload_index'])) {
            return;
        }

        $favoriteUploadIndex = (int) $payload['favorite_upload_index'];

        if (! array_key_exists($favoriteUploadIndex, $createdImageIds)) {
            return;
        }

        $this->setFavoriteImage($property, $createdImageIds[$favoriteUploadIndex]);
    }

    private function setFavoriteImage(Property $property, int $favoriteImageId): void
    {
        $orderedImageIds = $property->images()
            ->orderBy('sort_order')
            ->pluck('id')
            ->map(fn($id): int => (int) $id)
            ->all();

        if (! in_array($favoriteImageId, $orderedImageIds, true)) {
            return;
        }

        $nextOrder = [$favoriteImageId];

        foreach ($orderedImageIds as $id) {
            if ($id === $favoriteImageId) {
                continue;
            }

            $nextOrder[] = $id;
        }

        foreach ($nextOrder as $index => $id) {
            $property->images()->where('id', $id)->update(['sort_order' => $index + 1]);
        }
    }

    /**
     * @param  array<int, string>  $targetLocales
     * @return array<string, string>
     */
    private function mirrorAcrossLocales(string $text, string $sourceLocale, array $targetLocales): array
    {
        $trimmedText = trim($text);
        $translations = [$sourceLocale => $trimmedText];

        foreach ($targetLocales as $locale) {
            $translations[$locale] = $trimmedText;
        }

        return $translations;
    }
}
