<?php

namespace Database\Seeders;

use App\Models\Phase;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PhaseSeeder extends Seeder
{
    private const PHASES = [
        1 => [
            'phase_name' => 'CMS training',
        ],
        2 => [
            'phase_name' => 'Pre Pre-launch',
        ],
        3 => [
            'phase_name' => 'Pre-launch',
        ],
        4 => [
            'phase_name' => 'Post launch',
        ],
        5 => [
            'phase_name' => 'Offboarding',
        ],
    ];

    public function run()
    {
        foreach (self::PHASES as $phases => $phase)
        {
            Phase::create([
                'phase_name' => $phase['phase_name']
            ]);
        }
    }
}
