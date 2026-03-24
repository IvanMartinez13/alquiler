<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PropertyImage extends Model
{
    protected $fillable = [
        'property_id',
        'path',
        'alt',
        'alt_translations',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'alt_translations' => 'array',
        ];
    }

    public function getLocalizedAlt(?string $locale = null): ?string
    {
        $translations = $this->alt_translations;

        if (! is_array($translations) || $translations === []) {
            return $this->alt;
        }

        $locale = strtolower($locale ?? app()->getLocale());
        $fallback = strtolower((string) config('app.fallback_locale', 'en'));

        $value = (string) ($translations[$locale]
            ?? $translations[$fallback]
            ?? reset($translations)
            ?? $this->alt
            ?? '');

        return $value !== '' ? $value : null;
    }

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }
}
