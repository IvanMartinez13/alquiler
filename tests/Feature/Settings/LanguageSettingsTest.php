<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
});

test('language settings page is displayed', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('language.edit'))
        ->assertOk()
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('settings/language')
                ->where('currentLocale', 'en')
                ->has('locales', 3),
        );
});

test('language can be updated to spanish', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->from(route('language.edit'))
        ->patch(route('language.update'), [
            'locale' => 'es',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('language.edit'));

    $user->refresh();

    expect($user->locale)->toBe('es');
    expect(session('locale'))->toBe('es');
});

test('language update validates allowed locales', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->from(route('language.edit'))
        ->patch(route('language.update'), [
            'locale' => 'it',
        ])
        ->assertSessionHasErrors('locale')
        ->assertRedirect(route('language.edit'));
});
