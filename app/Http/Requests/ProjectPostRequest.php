<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProjectPostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
//    public function authorize()
//    {
//        return true;
//    }
//
//    protected function prepareForValidation()
//    {
//        $this->merge([
//            'user_id' => $this->user()->id
//        ]);
//    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'name' => 'required|string|max:40',
            'deadline' => 'required|date|after:today',
            'user_id' => 'required|exists:users,id',
            'phases' => 'required|array',
            'phases.*.phase_id' => 'required|exists:phases,id',
            'phases.*.deadline' => 'required|date|after:today',
        ];
    }
}
