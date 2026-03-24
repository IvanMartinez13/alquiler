<?php

namespace App\Models;

use App\Enums\PropertyStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Property extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'title_translations',
        'slug',
        'description',
        'description_translations',
        'address',
        'address_translations',
        'city',
        'city_translations',
        'country',
        'country_translations',
        'latitude',
        'longitude',
        'type',
        'max_guests',
        'bedrooms',
        'beds',
        'single_beds',
        'bathrooms',
        'check_in_time',
        'check_out_time',
        'notes',
        'notes_translations',
        'house_rules',
        'house_rules_translations',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'title_translations' => 'array',
            'description_translations' => 'array',
            'address_translations' => 'array',
            'city_translations' => 'array',
            'country_translations' => 'array',
            'notes_translations' => 'array',
            'house_rules' => 'array',
            'house_rules_translations' => 'array',
            'status' => PropertyStatus::class,
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (Property $property): void {
            if (! $property->isDirty('title') && filled($property->slug)) {
                return;
            }

            $property->slug = static::generateUniqueSlug($property->title, $property->id);
        });
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function amenities(): BelongsToMany
    {
        return $this->belongsToMany(Amenity::class, 'property_amenity');
    }

    public function images(): HasMany
    {
        return $this->hasMany(PropertyImage::class)->orderBy('sort_order');
    }

    public function scopeOwnedBy(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    public function getLocalizedTitle(?string $locale = null): string
    {
        return $this->resolveLocalizedValue($this->title_translations, $locale, $this->title);
    }

    public function getLocalizedDescription(?string $locale = null): string
    {
        return $this->resolveLocalizedValue(
            $this->description_translations,
            $locale,
            $this->description,
        );
    }

    public function getLocalizedAddress(?string $locale = null): string
    {
        return $this->resolveLocalizedValue($this->address_translations, $locale, $this->address);
    }

    public function getLocalizedCity(?string $locale = null): string
    {
        return $this->resolveLocalizedValue($this->city_translations, $locale, $this->city);
    }

    public function getLocalizedCountry(?string $locale = null): string
    {
        return $this->resolveLocalizedValue($this->country_translations, $locale, $this->country);
    }

    public function getLocalizedNotes(?string $locale = null): ?string
    {
        $value = $this->resolveLocalizedValue($this->notes_translations, $locale, $this->notes ?? '');

        return $value !== '' ? $value : null;
    }

    /**
     * @return array<string, mixed>|null
     */
    public function getLocalizedHouseRules(?string $locale = null): ?array
    {
        $rules = $this->house_rules;

        if (! is_array($rules)) {
            return null;
        }

        $translatedRules = $this->house_rules_translations;

        if (! is_array($translatedRules)) {
            return $rules;
        }

        foreach ($translatedRules as $key => $translations) {
            if (! is_string($key) || ! is_array($translations)) {
                continue;
            }

            $fallback = is_string($rules[$key] ?? null) ? (string) $rules[$key] : '';
            $rules[$key] = $this->resolveLocalizedValue($translations, $locale, $fallback);
        }

        return $rules;
    }

    /**
     * @param  array<string, string>|null  $translations
     */
    private function resolveLocalizedValue(?array $translations, ?string $locale, string $fallback): string
    {
        if (! is_array($translations) || $translations === []) {
            return $fallback;
        }

        $locale = strtolower($locale ?? app()->getLocale());
        $fallbackLocale = strtolower((string) config('app.fallback_locale', 'en'));

        return (string) ($translations[$locale]
            ?? $translations[$fallbackLocale]
            ?? reset($translations)
            ?? $fallback);
    }

    private static function generateUniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($title);
        $slug = $baseSlug;
        $suffix = 1;

        while (
            static::query()
            ->where('slug', $slug)
            ->when($ignoreId, fn(Builder $query) => $query->where('id', '!=', $ignoreId))
            ->exists()
        ) {
            $slug = sprintf('%s-%d', $baseSlug, $suffix);
            $suffix++;
        }

        return $slug;
    }
}
