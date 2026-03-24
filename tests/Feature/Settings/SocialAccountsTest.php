<?php

use App\Enums\UserRole;
use App\Models\User;
use App\Models\UserSocialAccount;
use Laravel\Socialite\Contracts\Provider;
use Laravel\Socialite\Facades\Socialite;

test('social accounts settings page is displayed for propietario', function () {
    $user = User::factory()->create([
        'role' => UserRole::PROPIETARIO,
    ]);

    $this->actingAs($user)
        ->get(route('social-accounts.edit'))
        ->assertOk();
});

test('cliente cannot access social accounts settings page', function () {
    $user = User::factory()->create([
        'role' => UserRole::CLIENTE,
    ]);

    $this->actingAs($user)
        ->get(route('social-accounts.edit'))
        ->assertRedirect(route('home'));
});

test('authenticated user can unlink a provider', function () {
    $user = User::factory()->create([
        'role' => UserRole::PROPIETARIO,
    ]);

    UserSocialAccount::query()->create([
        'user_id' => $user->id,
        'provider' => 'google',
        'provider_id' => 'google-id-123',
        'provider_email' => 'linked@example.com',
        'provider_name' => 'Linked User',
    ]);

    $this->actingAs($user)
        ->delete(route('social-accounts.destroy', ['provider' => 'google']))
        ->assertRedirect(route('social-accounts.edit'));

    $this->assertDatabaseMissing('user_social_accounts', [
        'user_id' => $user->id,
        'provider' => 'google',
    ]);
});

test('social callback links provider to authenticated user from settings flow', function () {
    $user = User::factory()->create([
        'role' => UserRole::PROPIETARIO,
    ]);

    $provider = \Mockery::mock(Provider::class);
    $socialiteUser = \Mockery::mock(\Laravel\Socialite\Contracts\User::class);

    Socialite::shouldReceive('driver')
        ->once()
        ->with('google')
        ->andReturn($provider);

    $provider->shouldReceive('user')
        ->once()
        ->andReturn($socialiteUser);

    $socialiteUser->shouldReceive('getId')->andReturn('google-link-id');
    $socialiteUser->shouldReceive('getEmail')->andReturn('linked@example.com');
    $socialiteUser->shouldReceive('getName')->andReturn('Linked User');
    $socialiteUser->shouldReceive('getNickname')->andReturn(null);
    $socialiteUser->shouldReceive('getAvatar')->andReturn('https://example.com/avatar.jpg');

    $this->actingAs($user)
        ->withSession(['social_linking_user_id' => $user->id])
        ->get(route('social.callback', ['provider' => 'google']))
        ->assertRedirect(route('social-accounts.edit'));

    $this->assertDatabaseHas('user_social_accounts', [
        'user_id' => $user->id,
        'provider' => 'google',
        'provider_id' => 'google-link-id',
    ]);
});
