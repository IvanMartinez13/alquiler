<?php

namespace App\Http\Requests\Property;

use Illuminate\Validation\Rule;

class UpdatePropertyRequest extends StorePropertyRequest
{
    public function authorize(): bool
    {
        $property = $this->route('property');

        return $this->user()?->can('update', $property) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            ...parent::rules(),
            'remove_image_ids' => ['nullable', 'array'],
            'remove_image_ids.*' => [
                'integer',
                Rule::exists('property_images', 'id')->where(
                    fn($query) => $query->where('property_id', $this->route('property')->id),
                ),
            ],
            'image_order' => ['nullable', 'array'],
            'image_order.*' => [
                'integer',
                Rule::exists('property_images', 'id')->where(
                    fn($query) => $query->where('property_id', $this->route('property')->id),
                ),
            ],
        ];
    }
}
