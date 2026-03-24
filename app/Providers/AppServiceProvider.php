<?php

namespace App\Providers;

use App\Enums\UserRole;
use App\Models\Amenity;
use App\Models\Property;
use App\Models\User;
use App\Policies\AmenityPolicy;
use App\Policies\PropertyPolicy;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use SocialiteProviders\Manager\SocialiteWasCalled;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();

        Gate::policy(Property::class, PropertyPolicy::class);
        Gate::policy(Amenity::class, AmenityPolicy::class);

        Event::listen(function (SocialiteWasCalled $event): void {
            $event->extendSocialite('apple', \SocialiteProviders\Apple\Provider::class);
        });
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(
            fn(): ?Password => app()->isProduction()
                ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
                : null,
        );

        Gate::define('manage-system', fn(User $user): bool => $user->isAdministrador());

        Gate::define('manage-property-bookings', fn(User $user): bool => $user->hasAnyRole([
            UserRole::ADMINISTRADOR,
            UserRole::PROPIETARIO,
        ]));

        Gate::define('create-bookings', fn(User $user): bool => $user->hasAnyRole([
            UserRole::ADMINISTRADOR,
            UserRole::CLIENTE,
        ]));
    }
}
