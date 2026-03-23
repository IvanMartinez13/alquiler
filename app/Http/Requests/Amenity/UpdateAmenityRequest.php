<?php

namespace App\Http\Requests\Amenity;

use App\Models\Amenity;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAmenityRequest extends FormRequest
{
    public function authorize(): bool
    {
        $amenity = $this->route('amenity');

        return $this->user()?->can('update', $amenity) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /** @var Amenity $amenity */
        $amenity = $this->route('amenity');

        return [
            'name' => ['required', 'string', 'max:120', Rule::unique('amenities', 'name')->ignore($amenity->id)],
            'icon' => ['nullable', 'string', 'max:120'],
            'description' => ['nullable', 'string', 'max:500'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
