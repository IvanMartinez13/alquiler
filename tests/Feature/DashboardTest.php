<?php

use App\Models\User;
use App\Enums\UserRole;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create([
        'role' => UserRole::PROPIETARIO,
    ]);
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});

test('cliente users are redirected from dashboard to landing', function () {
    $user = User::factory()->create([
        'role' => UserRole::CLIENTE,
    ]);

    $response = $this->actingAs($user)->get(route('dashboard'));

    $response->assertRedirect(route('home'));
});
