<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $supportedLocales = config('app.supported_locales', []);
        $defaultLocale = config('app.locale', 'en');

        $preferredLocale = $request->user()?->locale
            ?? $request->session()->get('locale')
            ?? $defaultLocale;

        $locale = in_array($preferredLocale, $supportedLocales, true)
            ? $preferredLocale
            : $defaultLocale;

        app()->setLocale($locale);
        $request->session()->put('locale', $locale);

        return $next($request);
    }
}
