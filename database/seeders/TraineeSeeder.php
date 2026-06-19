<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Trainee;
use Illuminate\Support\Str;
use Carbon\Carbon;

class TraineeSeeder extends Seeder
{
    public function run(): void
    {
        $religions = [
            'Roman Catholic',
            'Islam',
            'Iglesia ni Cristo',
            'Aglipayan',
            'Seventh-day Adventist',
            "Jehovah's Witnesses",
            'Born Again Christian',
            'Protestant',
            'Other Christian',
            'Buddhism',
            'Hinduism',
            'None',
        ];

        $statuses = ['Single', 'Married', 'Widowed'];
        $bloodTypes = ['A', 'A+', 'B', 'B+', 'AB', 'O', 'O+'];

        for ($i = 1; $i <= 20; $i++) {
            Trainee::create([
                'last_name' => "Trainee $i",
                'first_name' => "Trainee $i",
                'middle_name' => "Trainee $i",
                'serial_number' => "$i",
                'suffix' => "N/A",
                'birthday' => Carbon::now()->subYears(rand(18, 35))->subDays(rand(1, 365)),
                'religion' => $religions[array_rand($religions)],
                'contact_no' => '09' . rand(100000000, 999999999),
                'email' => "trainee$i@example.com",

                'status' => $statuses[array_rand($statuses)],
                'address' => "Sample Address Street $i, Manila",

                'emergency_contact_person' => "Guardian $i",
                'emergency_contact_no' => '09' . rand(100000000, 999999999),

                'blood_type' => $bloodTypes[array_rand($bloodTypes)],
                'height' => rand(150, 190),
                'weight' => rand(45, 90),

                'identifying_marks' => 'None',
                'eye_color' => 'Brown',
                'hair_color' => 'Black',
            ]);
        }
    }
}