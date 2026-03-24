<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('amenities', function (Blueprint $table) {
            if (! Schema::hasColumn('amenities', 'code')) {
                $table->string('code', 120)->nullable()->after('id');
            }

            if (! Schema::hasColumn('amenities', 'name_i18n')) {
                $table->json('name_i18n')->nullable()->after('icon');
            }

            if (! Schema::hasColumn('amenities', 'description_i18n')) {
                $table->json('description_i18n')->nullable()->after('name_i18n');
            }
        });

        $amenities = DB::table('amenities')->get();
        $usedCodes = [];

        foreach ($amenities as $amenity) {
            $name = (string) ($amenity->name ?? '');
            $description = $amenity->description;
            $baseCode = Str::slug($name);
            $baseCode = $baseCode !== '' ? $baseCode : ('amenity-' . $amenity->id);

            $code = $baseCode;
            $suffix = 1;

            while (in_array($code, $usedCodes, true) || DB::table('amenities')->where('code', $code)->where('id', '!=', $amenity->id)->exists()) {
                $code = $baseCode . '-' . $suffix;
                $suffix++;
            }

            $usedCodes[] = $code;

            DB::table('amenities')
                ->where('id', $amenity->id)
                ->update([
                    'code' => $code,
                    'name_i18n' => json_encode(['es' => $name], JSON_UNESCAPED_UNICODE),
                    'description_i18n' => filled($description)
                        ? json_encode(['es' => (string) $description], JSON_UNESCAPED_UNICODE)
                        : null,
                ]);
        }

        Schema::table('amenities', function (Blueprint $table) {
            if (Schema::hasColumn('amenities', 'name')) {
                $table->dropUnique('amenities_name_unique');
                $table->dropColumn('name');
            }

            if (Schema::hasColumn('amenities', 'description')) {
                $table->dropColumn('description');
            }
        });

        Schema::table('amenities', function (Blueprint $table) {
            if (Schema::hasColumn('amenities', 'name_i18n')) {
                $table->renameColumn('name_i18n', 'name');
            }

            if (Schema::hasColumn('amenities', 'description_i18n')) {
                $table->renameColumn('description_i18n', 'description');
            }

            if (Schema::hasColumn('amenities', 'code')) {
                $table->unique('code', 'amenities_code_unique');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('amenities', function (Blueprint $table) {
            $table->string('name_text', 120)->nullable()->after('icon');
            $table->string('description_text', 500)->nullable()->after('name_text');
        });

        $amenities = DB::table('amenities')->get();

        foreach ($amenities as $amenity) {
            $name = json_decode((string) $amenity->name, true);
            $description = $amenity->description ? json_decode((string) $amenity->description, true) : null;

            $nameText = is_array($name)
                ? ($name['es'] ?? $name['en'] ?? $name['de'] ?? (string) reset($name))
                : (string) $amenity->name;

            $descriptionText = is_array($description)
                ? ($description['es'] ?? $description['en'] ?? $description['de'] ?? (string) reset($description))
                : (string) ($amenity->description ?? '');

            DB::table('amenities')
                ->where('id', $amenity->id)
                ->update([
                    'name_text' => $nameText,
                    'description_text' => $descriptionText !== '' ? $descriptionText : null,
                ]);
        }

        Schema::table('amenities', function (Blueprint $table) {
            $table->dropUnique('amenities_code_unique');
            $table->dropColumn(['name', 'description', 'code']);
            $table->renameColumn('name_text', 'name');
            $table->renameColumn('description_text', 'description');
            $table->unique('name', 'amenities_name_unique');
        });
    }
};
