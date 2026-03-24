<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class GeocodingService
{
    /**
     * @return array{latitude: float, longitude: float}|null
     */
    public function geocode(string $fullAddress): ?array
    {
        $query = trim($fullAddress);

        if ($query === '') {
            return null;
        }

        $baseUrl = rtrim(
            (string) config('services.geocoding.endpoint', 'https://nominatim.openstreetmap.org/search'),
            '/',
        );

        $response = Http::timeout(10)
            ->acceptJson()
            ->withHeaders([
                'User-Agent' => (string) config('app.name', 'Laravel').'/1.0',
            ])
            ->get($baseUrl, [
                'q' => $query,
                'format' => 'jsonv2',
                'limit' => 1,
            ]);

        if (! $response->ok()) {
            return null;
        }

        $results = $response->json();

        if (! is_array($results) || $results === []) {
            return null;
        }

        $first = $results[0] ?? null;

        if (! is_array($first) || ! isset($first['lat'], $first['lon'])) {
            return null;
        }

        return [
            'latitude' => (float) $first['lat'],
            'longitude' => (float) $first['lon'],
        ];
    }
}
