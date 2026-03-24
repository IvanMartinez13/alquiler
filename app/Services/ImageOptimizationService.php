<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;

class ImageOptimizationService
{
    public function storeAsWebp(
        UploadedFile $image,
        string $directory,
        string $disk = 'public',
        int $quality = 82,
    ): string {
        if (! extension_loaded('gd')) {
            throw new RuntimeException('GD extension is required to optimize images to WebP.');
        }

        $binary = file_get_contents($image->getRealPath());

        if (! is_string($binary) || $binary === '') {
            throw new RuntimeException('Unable to read uploaded image content.');
        }

        $resource = imagecreatefromstring($binary);

        if (! $resource) {
            throw new RuntimeException('Unable to process uploaded image for WebP optimization.');
        }

        try {
            imagepalettetotruecolor($resource);
            imagealphablending($resource, true);
            imagesavealpha($resource, true);

            $tempFile = tmpfile();

            if (! $tempFile) {
                throw new RuntimeException('Unable to allocate temporary file for image optimization.');
            }

            $tempMeta = stream_get_meta_data($tempFile);
            $tempPath = $tempMeta['uri'] ?? null;

            if (! is_string($tempPath) || $tempPath === '') {
                fclose($tempFile);
                throw new RuntimeException('Unable to resolve temporary file path for image optimization.');
            }

            $webpSaved = imagewebp($resource, $tempPath, $quality);

            if (! $webpSaved) {
                fclose($tempFile);
                throw new RuntimeException('Unable to encode uploaded image to WebP format.');
            }

            $webpBinary = file_get_contents($tempPath);
            fclose($tempFile);

            if (! is_string($webpBinary) || $webpBinary === '') {
                throw new RuntimeException('Generated WebP image is empty.');
            }

            $path = sprintf('%s/%s.webp', trim($directory, '/'), Str::uuid()->toString());
            Storage::disk($disk)->put($path, $webpBinary);

            return $path;
        } finally {
            imagedestroy($resource);
        }
    }
}
