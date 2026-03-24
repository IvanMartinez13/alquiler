<?php

namespace App\Services;

use DeepL\DeepLClient;
use DeepL\TranslatorOptions;
use Throwable;

class TranslationService
{
    private ?DeepLClient $client = null;

    /**
     * @param  array<int, string>|null  $targetLocales
     * @return array<string, string>
     */
    public function translateToLocales(
        string $text,
        string $sourceLocale,
        ?array $targetLocales = null,
    ): array {
        $cleanText = trim($text);

        if ($cleanText === '') {
            return [];
        }

        $sourceLocale = $this->normalizeLocale($sourceLocale);
        $locales = $targetLocales ?? config('app.supported_locales', ['en']);
        $autoDetectSource = $this->shouldAutoDetectSourceLanguage();

        $translations = [];

        foreach ($locales as $locale) {
            $targetLocale = $this->normalizeLocale($locale);

            if ($targetLocale === '') {
                continue;
            }

            if ($targetLocale === $sourceLocale && ! $autoDetectSource) {
                $translations[$targetLocale] = $cleanText;

                continue;
            }

            $translations[$targetLocale] = $this->translate(
                text: $cleanText,
                sourceLocale: $sourceLocale,
                targetLocale: $targetLocale,
            );
        }

        if (! array_key_exists($sourceLocale, $translations)) {
            $translations[$sourceLocale] = $cleanText;
        }

        return $translations;
    }

    public function translate(string $text, string $sourceLocale, string $targetLocale): string
    {
        $cleanText = trim($text);

        if ($cleanText === '') {
            return '';
        }

        $sourceLocale = $this->normalizeLocale($sourceLocale);
        $targetLocale = $this->normalizeLocale($targetLocale);

        if ($sourceLocale === $targetLocale && ! $this->shouldAutoDetectSourceLanguage()) {
            return $cleanText;
        }

        $targetLang = $this->toDeepLTargetLanguage($targetLocale);

        if ($targetLang === null) {
            return $cleanText;
        }

        $sourceLang = $this->shouldAutoDetectSourceLanguage()
            ? null
            : $this->toDeepLSourceLanguage($sourceLocale);

        if (! $this->shouldAutoDetectSourceLanguage() && $sourceLang === null) {
            return $cleanText;
        }

        $client = $this->buildClient();

        if ($client === null) {
            return $cleanText;
        }

        try {
            $result = $client->translateText($cleanText, $sourceLang, $targetLang);
            $translatedText = is_array($result)
                ? (string) ($result[0]->text ?? $cleanText)
                : (string) ($result->text ?? $cleanText);

            return trim($translatedText) !== '' ? $translatedText : $cleanText;
        } catch (Throwable) {
            return $cleanText;
        }
    }

    private function buildClient(): ?DeepLClient
    {
        if ($this->client instanceof DeepLClient) {
            return $this->client;
        }

        $apiKey = (string) config('services.translation.deepl.api_key');

        if (trim($apiKey) === '') {
            return null;
        }

        $endpoint = (string) config('services.translation.deepl.endpoint', TranslatorOptions::DEFAULT_SERVER_URL_FREE);

        $options = [
            TranslatorOptions::SERVER_URL => rtrim($endpoint, '/'),
            TranslatorOptions::TIMEOUT => 20,
        ];

        $this->client = new DeepLClient($apiKey, $options);

        return $this->client;
    }

    private function shouldAutoDetectSourceLanguage(): bool
    {
        return (bool) config('services.translation.deepl.autodetect_source', true);
    }

    private function normalizeLocale(string $locale): string
    {
        return strtolower(strtok($locale, '-'));
    }

    private function toDeepLSourceLanguage(string $locale): ?string
    {
        return match ($this->normalizeLocale($locale)) {
            'es' => 'ES',
            'en' => 'EN',
            'de' => 'DE',
            default => null,
        };
    }

    private function toDeepLTargetLanguage(string $locale): ?string
    {
        return match ($this->normalizeLocale($locale)) {
            'es' => 'ES',
            'en' => 'EN-US',
            'de' => 'DE',
            default => null,
        };
    }
}
