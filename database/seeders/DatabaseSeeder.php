<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Administrador Demo',
            'email' => 'admin@example.com',
            'role' => UserRole::ADMINISTRADOR,
        ]);

        User::factory()->create([
            'name' => 'Propietario Demo',
            'email' => 'propietario@example.com',
            'role' => UserRole::PROPIETARIO,
        ]);

        User::factory()->create([
            'name' => 'Cliente Demo',
            'email' => 'cliente@example.com',
            'role' => UserRole::CLIENTE,
        ]);
    }
}
