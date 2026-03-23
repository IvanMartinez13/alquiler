<?php

namespace App\Http\Requests\Settings;

use App\Concerns\PasswordValidationRules;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class PasswordUpdateRequest extends FormRequest
{
    use PasswordValidationRules;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $currentPasswordRules = ['nullable', 'string'];

        if (! (bool) $this->session()->get('authenticated_via_social', false)) {
            $currentPasswordRules[] = 'required';
            $currentPasswordRules[] = 'current_password';
        }

        return [
            'current_password' => $currentPasswordRules,
            'password' => $this->passwordRules(),
        ];
    }
}
