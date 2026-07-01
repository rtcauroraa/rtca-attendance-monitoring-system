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
        //     Trainee::factory(50)->create();

      $admin = User::factory()->create([
    'name' => 'Admin',
    'email' => 'admin@gmail.com',
    'password' => Hash::make('admin123'),
]);
$admin->assignRole('Admin');

$user = User::factory()->create([
    'name' => 'Gangway Post 1',
    'email' => 'gangway@gmail.com',
    'password' => Hash::make('gangway123'),
]);
$user->assignRole('User');

$alpha = User::factory()->create([
    'name' => 'Alpha Company',
    'email' => 'alphacompany@gmail.com',
    'password' => Hash::make('alpha1192026'),
]);
$alpha->assignRole('Alpha');

$bravo = User::factory()->create([
    'name' => 'Bravo Company',
    'email' => 'bravocompany@gmail.com',
    'password' => Hash::make('bravo1192026'),
]);
$bravo->assignRole('Bravo');

$charlie = User::factory()->create([
    'name' => 'Charlie Company',
    'email' => 'charliecompany@gmail.com',
    'password' => Hash::make('charlie1192026'),
]);
$charlie->assignRole('Charlie');

$delta = User::factory()->create([
    'name' => 'Delta Company',
    'email' => 'deltacompany@gmail.com',
    'password' => Hash::make('delta1192026'),
]);
$delta->assignRole('Delta');
    
    }
}