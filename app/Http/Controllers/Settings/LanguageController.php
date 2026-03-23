<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class LanguageController extends Controller
{
    public function edit(Request $request): Response
    {
        $supportedLocales = config('app.supported_locales', ['en']);

        return Inertia::render('settings/language', [
            'currentLocale' => app()->getLocale(),
            'locales' => collect($supportedLocales)->map(fn(string $locale): array => [
                'value' => $locale,
                'label' => match ($locale) {
                    'es' => 'Español',
                    'en' => 'English',
                    'de' => 'Deutsch',
                    default => strtoupper($locale),
                },
            ])->values(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $supportedLocales = config('app.supported_locales', ['en']);

        $validated = $request->validate([
            'locale' => ['required', 'string', Rule::in($supportedLocales)],
        ]);

        $request->session()->put('locale', $validated['locale']);

        $request->user()?->forceFill([
            'locale' => $validated['locale'],
        ])->save();

        app()->setLocale($validated['locale']);

        return back();
    }
}
