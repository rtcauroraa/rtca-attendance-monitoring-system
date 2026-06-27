<?php

namespace Database\Seeders;

use App\Models\TraineeMovement;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TraineeMovementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
           TraineeMovement::factory()
            ->count(50)
            ->create();
    }
}
