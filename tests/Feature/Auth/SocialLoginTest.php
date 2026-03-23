<?php

use App\Enums\UserRole;
use App\Models\User;
use Laravel\Socialite\Contracts\Provider;
use Laravel\Socialite\Contracts\User as SocialiteUser;
use Laravel\Socialite\Facades\Socialite;

test('social callback creates a new cliente user and logs in', function () {
    $provider = \Mockery::mock(Provider::class);
    $socialiteUser = \Mockery::mock(SocialiteUser::class);

    Socialite::shouldReceive('driver')
        ->once()
        ->with('google')
        ->andReturn($provider);

    $provider->shouldReceive('user')
        ->once()
        ->andReturn($socialiteUser);

    $socialiteUser->shouldReceive('getId')->andReturn('google-id-1');
    $socialiteUser->shouldReceive('getEmail')->andReturn('social@example.com');
    $socialiteUser->shouldReceive('getName')->andReturn('Social User');
    $socialiteUser->shouldReceive('getNickname')->andReturn(null);
    $socialiteUser->shouldReceive('getAvatar')->andReturn('https://example.com/avatar.jpg');

    $response = $this->get(route('social.callback', ['provider' => 'google']));

    $response->assertRedirect(route('dashboard'));
    $this->assertAuthenticated();

    $user = User::query()->where('email', 'social@example.com')->first();

    expect($user)->not->toBeNull()
        ->and($user->role)->toBe(UserRole::CLIENTE);

    $socialAccount = $user->socialAccounts()->where('provider', 'google')->first();

    expect($socialAccount)->not->toBeNull()
        ->and($socialAccount->provider_id)->toBe('google-id-1');
});

test('social callback links existing user by email', function () {
    $existingUser = User::factory()->create([
        'email' => 'existing@example.com',
        'role' => UserRole::PROPIETARIO,
    ]);

    $provider = \Mockery::mock(Provider::class);
    $socialiteUser = \Mockery::mock(SocialiteUser::class);

    Socialite::shouldReceive('driver')
        ->once()
        ->with('facebook')
        ->andReturn($provider);

    $provider->shouldReceive('user')
        ->once()
        ->andReturn($socialiteUser);

    $socialiteUser->shouldReceive('getId')->andReturn('facebook-id-1');
    $socialiteUser->shouldReceive('getEmail')->andReturn('existing@example.com');
    $socialiteUser->shouldReceive('getName')->andReturn('Existing User');
    $socialiteUser->shouldReceive('getNickname')->andReturn(null);
    $socialiteUser->shouldReceive('getAvatar')->andReturn(null);

    $this->get(route('social.callback', ['provider' => 'facebook']))
        ->assertRedirect(route('dashboard'));

    $existingUser->refresh();

    $socialAccount = $existingUser->socialAccounts()->where('provider', 'facebook')->first();

    expect($socialAccount)->not->toBeNull()
        ->and($socialAccount->provider_id)->toBe('facebook-id-1')
        ->and($existingUser->role)->toBe(UserRole::PROPIETARIO);
});

test('social routes only accept supported providers', function () {
    $this->get('/auth/unknown/redirect')->assertNotFound();
    $this->get('/auth/unknown/callback')->assertNotFound();
});
