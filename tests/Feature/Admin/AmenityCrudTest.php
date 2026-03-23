<?php

use App\Enums\UserRole;
use App\Models\Amenity;
use App\Models\User;

beforeEach(function () {
    $this->withoutVite();
});

test('administrador can manage amenities', function () {
    $admin = User::factory()->create([
        'role' => UserRole::ADMINISTRADOR,
    ]);

    $this->actingAs($admin)
        ->get(route('admin.amenities.index'))
        ->assertOk();

    $this->actingAs($admin)
        ->post(route('admin.amenities.store'), [
            'name' => 'Wifi',
            'icon' => 'wifi',
            'description' => 'Internet de alta velocidad',
            'is_active' => true,
        ])
        ->assertRedirect();

    $amenity = Amenity::query()->where('name', 'Wifi')->firstOrFail();

    $this->actingAs($admin)
        ->put(route('admin.amenities.update', $amenity), [
            'name' => 'Wifi premium',
            'icon' => 'wifi',
            'description' => 'Internet estable',
            'is_active' => true,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('amenities', [
        'id' => $amenity->id,
        'name' => 'Wifi premium',
    ]);
});

test('non administrador is redirected when accessing amenities routes', function () {
    $owner = User::factory()->create([
        'role' => UserRole::PROPIETARIO,
    ]);

    $this->actingAs($owner)
        ->get(route('admin.amenities.index'))
        ->assertRedirect(route('home'));
});
