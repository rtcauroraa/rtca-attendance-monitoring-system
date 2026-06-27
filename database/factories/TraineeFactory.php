<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Trainee>
 */
class TraineeFactory extends Factory
{
    public function definition(): array
    {
        $firstName = fake()->firstName();
        $lastName = fake()->lastName();

        return [
            'first_name' => $firstName,
            'middle_name' => fake()->lastName(),
            'last_name' => $lastName,
            'serial_number' => strtoupper(fake()->bothify('SN-####-???')),
            'suffix' => fake()->randomElement(['N/A', 'Jr.', 'Sr.', 'III', 'IV']),
            'birthday' => fake()->optional()->date(),
            'religion' => fake()->optional()->randomElement(['None', 'Aglipayan', 'Islam', 'Roman Catholic']),
            'contact_no' => fake()->phoneNumber(),
            'email' => fake()->unique()->safeEmail(),

            'status' => fake()->randomElement(['ACTIVE', 'INACTIVE', 'GRADUATED']),
            'coy' => fake()->randomElement(['Alpha', 'Bravo', 'Charlie', 'Delta']),

            'address' => fake()->address(),

            'emergency_contact_person' => fake()->name(),
            'emergency_contact_no' => fake()->phoneNumber(),

            'blood_type' => fake()->randomElement(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+']),
            'height' => fake()->numberBetween(150, 190),
            'weight' => fake()->numberBetween(45, 100),

            'qr_code' => 'QR-' . Str::upper(Str::random(10)),

            'identifying_marks' => fake()->optional()->sentence(),
            'eye_color' => fake()->randomElement(['Brown', 'Black', 'Blue', 'Green']),
            'hair_color' => fake()->randomElement(['Black', 'Brown', 'Blonde']),
        ];
    }
}
