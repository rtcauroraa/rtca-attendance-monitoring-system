<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Trainee;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
            // Trainee::factory(50)->create();

        $admin = User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => 'admin123',
        ]);
        $admin->assignRole('Admin');

        $user = User::factory()->create([
            'name' => 'Gangway Post 1',
            'email' => 'gangway@gmail.com',
            'password' => 'gangway123',
        ]);

        $user->assignRole('User');

        }
    

}
