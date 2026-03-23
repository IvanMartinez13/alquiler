<?php

use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\SecurityController;
use App\Http\Controllers\Settings\SocialAccountController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::redirect('settings', '/settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');

    Route::get('settings/social-accounts', [SocialAccountController::class, 'edit'])
        ->name('social-accounts.edit');

    Route::get('settings/social-accounts/{provider}/redirect', [SocialAccountController::class, 'redirect'])
        ->whereIn('provider', ['google', 'facebook', 'apple'])
        ->name('social-accounts.redirect');

    Route::delete('settings/social-accounts/{provider}', [SocialAccountController::class, 'destroy'])
        ->whereIn('provider', ['google', 'facebook', 'apple'])
        ->name('social-accounts.destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/security', [SecurityController::class, 'edit'])->name('security.edit');

    Route::put('settings/password', [SecurityController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    Route::inertia('settings/appearance', 'settings/appearance')->name('appearance.edit');
});
