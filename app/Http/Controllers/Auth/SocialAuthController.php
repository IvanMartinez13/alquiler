<?php

namespace App\Http\Controllers\Auth;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserSocialAccount;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    private const ALLOWED_PROVIDERS = ['google', 'facebook'];

    public function redirect(string $provider): RedirectResponse
    {
        abort_unless(in_array($provider, self::ALLOWED_PROVIDERS, true), 404);

        return Socialite::driver($provider)->redirect();
    }

    public function callback(Request $request, string $provider): RedirectResponse
    {
        abort_unless(in_array($provider, self::ALLOWED_PROVIDERS, true), 404);

        $socialUser = Socialite::driver($provider)->user();

        $providerId = $socialUser->getId();
        $email = $socialUser->getEmail();
        $name = $socialUser->getName() ?: $socialUser->getNickname() ?: 'Usuario';
        $avatar = $socialUser->getAvatar();

        $linkingUserId = $request->session()->pull('social_linking_user_id');

        if ($linkingUserId) {
            $user = User::query()->findOrFail($linkingUserId);

            $belongsToDifferentUser = UserSocialAccount::query()
                ->where('provider', $provider)
                ->where('provider_id', $providerId)
                ->where('user_id', '!=', $user->id)
                ->exists();

            if ($belongsToDifferentUser) {
                return to_route('social-accounts.edit')->with('status', sprintf('La cuenta %s ya esta vinculada a otro usuario.', ucfirst($provider)));
            }

            $user->socialAccounts()->updateOrCreate(
                ['provider' => $provider],
                [
                    'provider_id' => $providerId,
                    'provider_email' => $email,
                    'provider_name' => $name,
                    'avatar' => $avatar,
                ],
            );

            if (! $user->avatar && $avatar) {
                $user->forceFill(['avatar' => $avatar])->save();
            }

            return to_route('social-accounts.edit')->with('status', sprintf('Cuenta %s vinculada correctamente.', ucfirst($provider)));
        }

        $socialAccount = UserSocialAccount::query()
            ->where('provider', $provider)
            ->where('provider_id', $providerId)
            ->first();

        $user = $socialAccount?->user;

        if (! $user && $email) {
            $user = User::query()->where('email', $email)->first();
        }

        if (! $user) {
            $user = User::create([
                'name' => $name,
                'email' => $email ?: $this->generateFallbackEmail($provider, $providerId),
                'password' => Hash::make(Str::random(64)),
                'role' => UserRole::CLIENTE,
                'avatar' => $avatar,
                'email_verified_at' => $email ? now() : null,
            ]);
        } else {
            $user->forceFill([
                'name' => $user->name ?: $name,
                'avatar' => $avatar ?: $user->avatar,
                'email_verified_at' => $user->email_verified_at ?: ($email ? now() : null),
            ])->save();
        }

        $user->socialAccounts()->updateOrCreate(
            ['provider' => $provider],
            [
                'provider_id' => $providerId,
                'provider_email' => $email,
                'provider_name' => $name,
                'avatar' => $avatar,
            ],
        );

        Auth::login($user, remember: true);

        return redirect()->intended(route('dashboard'));
    }

    private function generateFallbackEmail(string $provider, string $providerId): string
    {
        return sprintf('%s-%s@social.local', $provider, $providerId);
    }
}
