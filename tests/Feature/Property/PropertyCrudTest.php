<?php

use App\Enums\PropertyStatus;
use App\Enums\PropertyType;
use App\Enums\UserRole;
use App\Models\Property;
use App\Models\User;

beforeEach(function () {
    $this->withoutVite();
});

function propertyPayload(array $overrides = []): array
{
    return array_merge([
        'title' => 'Apartamento en centro historico',
        'description' => 'Descripcion larga de la propiedad para pruebas.',
        'address' => 'Calle Principal 123',
        'city' => 'Valencia',
        'country' => 'Spain',
        'latitude' => 39.4699,
        'longitude' => -0.3763,
        'type' => PropertyType::APARTMENT->value,
        'max_guests' => 4,
        'bedrooms' => 2,
        'beds' => 2,
        'bathrooms' => 1,
        'check_in_time' => '15:00',
        'check_out_time' => '11:00',
        'status' => PropertyStatus::DRAFT->value,
    ], $overrides);
}

test('propietario can list and create properties', function () {
    $owner = User::factory()->create([
        'role' => UserRole::PROPIETARIO,
    ]);

    $this->actingAs($owner)
        ->get(route('properties.index'))
        ->assertOk();

    $this->actingAs($owner)
        ->post(route('properties.store'), propertyPayload())
        ->assertRedirect();

    $this->assertDatabaseHas('properties', [
        'user_id' => $owner->id,
        'title' => 'Apartamento en centro historico',
    ]);
});

test('propietario cannot view property from another owner', function () {
    $ownerA = User::factory()->create([
        'role' => UserRole::PROPIETARIO,
    ]);

    $ownerB = User::factory()->create([
        'role' => UserRole::PROPIETARIO,
    ]);

    $property = Property::query()->create([
        'user_id' => $ownerA->id,
        ...propertyPayload(['title' => 'Propiedad privada']),
    ]);

    $this->actingAs($ownerB)
        ->get(route('properties.show', $property))
        ->assertForbidden();
});

test('cliente is redirected to home when accessing properties routes', function () {
    $client = User::factory()->create([
        'role' => UserRole::CLIENTE,
    ]);

    $this->actingAs($client)
        ->get(route('properties.index'))
        ->assertRedirect(route('home'));
});
