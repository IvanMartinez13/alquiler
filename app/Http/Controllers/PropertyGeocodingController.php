<?php

namespace App\Http\Controllers;

use App\Services\GeocodingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PropertyGeocodingController extends Controller
{
    public function __construct(private readonly GeocodingService $geocodingService) {}

    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'full_address' => ['required', 'string', 'max:1000'],
        ]);

        $coordinates = $this->geocodingService->geocode($validated['full_address']);

        if ($coordinates === null) {
            return response()->json([
                'message' => 'Coordinates not found',
            ], 422);
        }

        return response()->json($coordinates);
    }
}
