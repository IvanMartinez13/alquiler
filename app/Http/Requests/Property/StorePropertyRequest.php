<?php

namespace App\Http\Requests\Property;

use App\Enums\PropertyStatus;
use App\Enums\PropertyType;
use App\Models\Property;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePropertyRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        $this->merge([
            'latitude' => $this->normalizeCoordinate($this->input('latitude')),
            'longitude' => $this->normalizeCoordinate($this->input('longitude')),
        ]);
    }

    public function authorize(): bool
    {
        return $this->user()?->can('create', Property::class) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:5000'],
            'address' => ['required', 'string', 'max:1000'],
            'city' => ['required', 'string', 'max:120'],
            'country' => ['required', 'string', 'max:120'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'type' => ['required', Rule::enum(PropertyType::class)],
            'max_guests' => ['required', 'integer', 'min:1', 'max:100'],
            'bedrooms' => ['required', 'integer', 'min:0', 'max:100'],
            'beds' => ['required', 'integer', 'min:0', 'max:200'],
            'single_beds' => ['required', 'integer', 'min:0', 'max:200'],
            'bathrooms' => ['required', 'integer', 'min:1', 'max:100'],
            'check_in_time' => ['required', 'date_format:H:i'],
            'check_out_time' => ['required', 'date_format:H:i'],
            'notes' => ['nullable', 'string', 'max:5000'],
            'status' => ['required', Rule::enum(PropertyStatus::class)],
            'amenities' => ['nullable', 'array'],
            'amenities.*' => ['integer', 'exists:amenities,id'],
            'source_locale' => ['nullable', 'string', 'in:es,en,de'],
            'images' => ['nullable', 'array'],
            'images.*' => ['image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
            'favorite_upload_index' => ['nullable', 'integer', 'min:0'],
            'house_rules' => ['nullable', 'array'],
            'house_rules.check_in' => ['nullable', 'string', 'max:255'],
            'house_rules.check_out' => ['nullable', 'string', 'max:255'],
            'house_rules.cancellation_policy' => ['nullable', 'string', 'max:2000'],
            'house_rules.damage_deposit' => ['nullable', 'string', 'max:255'],
            'house_rules.children_policy' => ['nullable', 'string', 'max:1000'],
            'house_rules.age_restriction' => ['nullable', 'string', 'max:255'],
            'house_rules.free_cancellation' => ['nullable', 'boolean'],
            'house_rules.smoking_allowed' => ['nullable', 'boolean'],
            'house_rules.pets_allowed' => ['nullable', 'boolean'],
        ];
    }

    private function normalizeCoordinate(mixed $value): mixed
    {
        if (! is_string($value)) {
            return $value;
        }

        $normalized = str_replace(',', '.', trim($value));

        return $normalized !== '' ? $normalized : null;
    }
}
