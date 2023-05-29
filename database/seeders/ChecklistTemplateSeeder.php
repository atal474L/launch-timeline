<?php

namespace Database\Seeders;

use App\Models\ChecklistTemplate;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ChecklistTemplateSeeder extends Seeder
{
    private const Template = [
        [
            'phase_id' => 1,
            'question' => 'CMS inorde'
        ],
        [
            'phase_id' => 1,
            'question' => 'CMS inorde 2'
        ],
        [
            'phase_id' => 1,
            'question' => 'CMS inorde 3'
        ],
        [
            'phase_id' => 2,
            'question' => 'pre pre launch'
        ],
        [
            'phase_id' => 2,
            'question' => 'pre pre launch 2'
        ],
    ];

    public function run()
    {
        foreach (self::Template as $question) {
            ChecklistTemplate::create([
                'phase_id' => $question['phase_id'],
                'question' => $question['question'],
            ]);
        }
    }
}
