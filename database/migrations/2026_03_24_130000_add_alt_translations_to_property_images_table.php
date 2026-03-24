<?php

use App\Models\PropertyImage;
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
        Schema::table('property_images', function (Blueprint $table): void {
            $table->json('alt_translations')->nullable()->after('alt');
        });

        PropertyImage::query()->each(function (PropertyImage $image): void {
            if (! is_string($image->alt) || trim($image->alt) === '') {
                return;
            }

            $text = trim($image->alt);

            $image->forceFill([
                'alt_translations' => [
                    'es' => $text,
                    'en' => $text,
                    'de' => $text,
                ],
            ])->save();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('property_images', function (Blueprint $table): void {
            $table->dropColumn('alt_translations');
        });
    }
};
