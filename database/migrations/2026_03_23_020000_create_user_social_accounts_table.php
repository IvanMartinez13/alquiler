<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_social_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('provider');
            $table->string('provider_id');
            $table->string('provider_email')->nullable();
            $table->string('provider_name')->nullable();
            $table->string('avatar')->nullable();
            $table->timestamps();

            $table->unique(['provider', 'provider_id']);
            $table->unique(['user_id', 'provider']);
        });

        // Preserve already-linked accounts stored on users table from previous implementation.
        DB::table('users')
            ->whereNotNull('provider_name')
            ->whereNotNull('provider_id')
            ->orderBy('id')
            ->chunkById(200, function ($users): void {
                foreach ($users as $user) {
                    DB::table('user_social_accounts')->updateOrInsert(
                        [
                            'provider' => $user->provider_name,
                            'provider_id' => $user->provider_id,
                        ],
                        [
                            'user_id' => $user->id,
                            'provider_email' => $user->email,
                            'provider_name' => $user->name,
                            'avatar' => $user->avatar,
                            'updated_at' => now(),
                            'created_at' => now(),
                        ],
                    );
                }
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_social_accounts');
    }
};
