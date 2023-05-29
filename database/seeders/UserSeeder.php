<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    private const USERS = [
        'atal' => [
            'name' => 'Atal',
        ],
        'jyrki' => [
            'name' => 'Jyrki',
        ],
        'sander' => [
            'name' => 'Sander',
        ],
    ];




    public function run()
    {
        foreach (self::USERS as $name => $user)
        {
            User::factory([
                'name' => $user['name']
            ])->create();
        }
    }
}
