<?php

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Support\Facades\Route;

beforeEach(function () {
    Route::middleware(['web', 'auth', 'role:administrador'])
    ->get('/testing/admin-only', fn () => 'ok');
});

test('administrador can access admin-only routes', function () {
    $admin = User::factory()->create([
        'role' => UserRole::ADMINISTRADOR,
    ]);

    $response = $this->actingAs($admin)->get('/testing/admin-only');

    $response->assertOk();
    $response->assertSee('ok');
});

test('non administrador is forbidden from admin-only routes', function () {
    $client = User::factory()->create([
        'role' => UserRole::CLIENTE,
    ]);

    $response = $this->actingAs($client)->get('/testing/admin-only');

    $response->assertForbidden();
});
