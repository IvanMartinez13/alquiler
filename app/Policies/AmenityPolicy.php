<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Amenity;
use App\Models\User;

class AmenityPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role === UserRole::ADMINISTRADOR;
    }

    public function view(User $user, Amenity $amenity): bool
    {
        return $user->role === UserRole::ADMINISTRADOR;
    }

    public function create(User $user): bool
    {
        return $user->role === UserRole::ADMINISTRADOR;
    }

    public function update(User $user, Amenity $amenity): bool
    {
        return $user->role === UserRole::ADMINISTRADOR;
    }

    public function delete(User $user, Amenity $amenity): bool
    {
        return $user->role === UserRole::ADMINISTRADOR;
    }
}
