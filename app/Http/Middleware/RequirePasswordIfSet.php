<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\Middleware\RequirePassword;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequirePasswordIfSet
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ((bool) $request->session()->get('authenticated_via_social', false)) {
            return $next($request);
        }

        return app(RequirePassword::class)->handle($request, $next);
    }
}
