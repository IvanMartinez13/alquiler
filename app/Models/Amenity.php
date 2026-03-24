<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class Amenity extends Model
{
    protected $fillable = [
        'code',
        'name',
        'icon',
        'description',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'name' => 'array',
            'description' => 'array',
            'is_active' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (Amenity $amenity): void {
            if (filled($amenity->code)) {
                return;
            }

            $baseName = is_array($amenity->name)
                ? (string) ($amenity->name['es'] ?? $amenity->name['en'] ?? reset($amenity->name) ?? '')
                : (string) $amenity->name;

            $amenity->code = static::generateUniqueCode($baseName, $amenity->id);
        });
    }

    public function getLocalizedName(?string $locale = null): string
    {
        return $this->resolveLocalizedValue($this->name, $locale);
    }

    public function getLocalizedDescription(?string $locale = null): ?string
    {
        $value = $this->resolveLocalizedValue($this->description, $locale);

        return $value !== '' ? $value : null;
    }

    public function properties(): BelongsToMany
    {
        return $this->belongsToMany(Property::class, 'property_amenity');
    }

    /**
     * @param  array<string, string>|string|null  $value
     */
    private function resolveLocalizedValue(array|string|null $value, ?string $locale): string
    {
        if (is_string($value)) {
            return $value;
        }

        if (! is_array($value) || $value === []) {
            return '';
        }

        $locale = strtolower($locale ?? app()->getLocale());
        $fallback = strtolower((string) config('app.fallback_locale', 'en'));

        return (string) ($value[$locale]
            ?? $value[$fallback]
            ?? reset($value)
            ?? '');
    }

    private static function generateUniqueCode(string $name, ?int $ignoreId = null): string
    {
        $baseCode = Str::slug($name);
        $baseCode = $baseCode !== '' ? $baseCode : 'amenity';
        $code = $baseCode;
        $suffix = 1;

        while (
            static::query()
            ->where('code', $code)
            ->when($ignoreId, fn(Builder $query) => $query->where('id', '!=', $ignoreId))
            ->exists()
        ) {
            $code = sprintf('%s-%d', $baseCode, $suffix);
            $suffix++;
        }

        return $code;
    }
}
