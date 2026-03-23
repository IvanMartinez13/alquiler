<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::middleware('role:administrador')->prefix('admin')->group(function () {
        Route::get('panel', fn () => response()->json([
            'message' => 'Zona de administrador',
        ]))->name('admin.panel');
    });

    Route::middleware('role:administrador,propietario')->prefix('propietario')->group(function () {
        Route::get('panel', fn () => response()->json([
            'message' => 'Zona de gestion de propiedades y reservas',
        ]))->name('owner.panel');
    });

    Route::middleware('role:administrador,cliente')->prefix('cliente')->group(function () {
        Route::get('panel', fn () => response()->json([
            'message' => 'Zona de reservas y consulta de fechas',
        ]))->name('client.panel');
    });
});

require __DIR__.'/settings.php';
