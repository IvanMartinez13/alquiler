<?php

use App\Models\Property;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table): void {
            $table->json('title_translations')->nullable()->after('title');
            $table->json('description_translations')->nullable()->after('description');
            $table->json('address_translations')->nullable()->after('address');
            $table->json('city_translations')->nullable()->after('city');
            $table->json('country_translations')->nullable()->after('country');
            $table->json('notes_translations')->nullable()->after('notes');
            $table->json('house_rules_translations')->nullable()->after('house_rules');
        });

        Property::query()->each(function (Property $property): void {
            $property->forceFill([
                'title_translations' => ['es' => $property->title],
                'description_translations' => ['es' => $property->description],
                'address_translations' => ['es' => $property->address],
                'city_translations' => ['es' => $property->city],
                'country_translations' => ['es' => $property->country],
                'notes_translations' => $property->notes ? ['es' => $property->notes] : null,
            ])->save();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table): void {
            $table->dropColumn([
                'title_translations',
                'description_translations',
                'address_translations',
                'city_translations',
                'country_translations',
                'notes_translations',
                'house_rules_translations',
            ]);
        });
    }
};
