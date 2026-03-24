<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Handle an incoming request.
     *
     * @param  array<int, string>  $roles
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            abort(Response::HTTP_UNAUTHORIZED);
        }

        if (empty($roles)) {
            return $next($request);
        }

        $allowedRoles = array_map(
            static fn(string $role): string => UserRole::from($role)->value,
            $roles,
        );

        if (! in_array($user->role->value, $allowedRoles, true)) {
            if (! $request->expectsJson()) {
                return redirect()->route('home');
            }

            abort(Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}
