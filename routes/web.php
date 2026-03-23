<?php

use App\Http\Controllers\Admin\AmenityController;
use App\Http\Controllers\Auth\SocialAuthController;
use App\Http\Controllers\PropertyController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware('guest')->group(function () {
    Route::get('auth/{provider}/redirect', [SocialAuthController::class, 'redirect'])
        ->whereIn('provider', ['google', 'facebook'])
        ->name('social.redirect');
});

Route::match(['get', 'post'], 'auth/{provider}/callback', [SocialAuthController::class, 'callback'])
    ->whereIn('provider', ['google', 'facebook'])
    ->name('social.callback');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')
        ->middleware('role:administrador,propietario')
        ->name('dashboard');

    Route::middleware('role:administrador')->prefix('admin')->group(function () {
        Route::get('panel', fn() => response()->json([
            'message' => 'Zona de administrador',
        ]))->name('admin.panel');

        Route::resource('amenities', AmenityController::class)
            ->only(['index', 'store', 'update', 'destroy'])
            ->names('admin.amenities');
    });

    Route::middleware('role:administrador,propietario')->prefix('propietario')->group(function () {
        Route::get('panel', fn() => response()->json([
            'message' => 'Zona de gestion de propiedades y reservas',
        ]))->name('owner.panel');
    });

    Route::middleware('role:administrador,cliente')->prefix('cliente')->group(function () {
        Route::get('panel', fn() => response()->json([
            'message' => 'Zona de reservas y consulta de fechas',
        ]))->name('client.panel');
    });

    Route::middleware('role:propietario')->group(function () {
        Route::resource('properties', PropertyController::class);
    });
});

require __DIR__ . '/settings.php';
