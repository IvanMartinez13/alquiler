<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\UserSocialAccount;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Socialite\Facades\Socialite;

class SocialAccountController extends Controller
{
    private const SUPPORTED_PROVIDERS = ['google', 'facebook', 'apple'];

    public function edit(Request $request): Response
    {
        $linkedAccounts = $request->user()
            ->socialAccounts()
            ->get()
            ->keyBy('provider');

        $providers = collect(self::SUPPORTED_PROVIDERS)
            ->map(function (string $provider) use ($linkedAccounts): array {
                $account = $linkedAccounts->get($provider);

                return [
                    'key' => $provider,
                    'label' => ucfirst($provider),
                    'connected' => $account !== null,
                    'connected_email' => $account?->provider_email,
                    'avatar' => $account?->avatar,
                ];
            })
            ->values();

        return Inertia::render('settings/social-accounts', [
            'providers' => $providers,
            'status' => $request->session()->get('status'),
        ]);
    }

    public function redirect(Request $request, string $provider): RedirectResponse
    {
        abort_unless(in_array($provider, self::SUPPORTED_PROVIDERS, true), 404);

        $request->session()->put('social_linking_user_id', $request->user()->id);

        return Socialite::driver($provider)
            ->redirectUrl(route('social.callback', ['provider' => $provider]))
            ->redirect();
    }

    public function destroy(Request $request, string $provider): RedirectResponse
    {
        abort_unless(in_array($provider, self::SUPPORTED_PROVIDERS, true), 404);

        UserSocialAccount::query()
            ->where('user_id', $request->user()->id)
            ->where('provider', $provider)
            ->delete();

        return to_route('social-accounts.edit')->with('status', sprintf('Cuenta %s desvinculada.', ucfirst($provider)));
    }
}
