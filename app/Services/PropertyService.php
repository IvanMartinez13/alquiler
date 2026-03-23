<?php

namespace App\Services;

use App\Models\Property;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PropertyService
{
    /**
     * @param  array<string, mixed>  $payload
     */
    public function createForOwner(int $ownerId, array $payload): Property
    {
        return DB::transaction(function () use ($ownerId, $payload): Property {
            $property = Property::query()->create([
                ...Arr::except($payload, ['amenities', 'images']),
                'user_id' => $ownerId,
            ]);

            $this->syncAmenities($property, $payload);
            $this->storeNewImages($property, $payload);

            return $property->load(['amenities', 'images']);
        });
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    public function update(Property $property, array $payload): Property
    {
        return DB::transaction(function () use ($property, $payload): Property {
            $property->fill(Arr::except($payload, ['amenities', 'images', 'remove_image_ids', 'image_order']));
            $property->save();

            $this->syncAmenities($property, $payload);
            $this->removeImages($property, $payload);
            $this->storeNewImages($property, $payload);
            $this->sortImages($property, $payload);

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
    private function storeNewImages(Property $property, array $payload): void
    {
        /** @var array<int, UploadedFile> $images */
        $images = $payload['images'] ?? [];

        if ($images === []) {
            return;
        }

        $maxSortOrder = (int) $property->images()->max('sort_order');

        foreach ($images as $index => $image) {
            $path = $image->store(sprintf('properties/%d', $property->id), 'public');

            $property->images()->create([
                'path' => $path,
                'alt' => $property->title,
                'sort_order' => $maxSortOrder + $index + 1,
            ]);
        }
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
}
