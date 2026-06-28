<?php

namespace Database\Factories;

use App\Models\TraineeMovement;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

class TraineeMovementFactory extends Factory
{
    protected $model = TraineeMovement::class;

    public function definition(): array
    {
        // 📌 issued_at
        $issuedAt = Carbon::instance(
            $this->faker->dateTimeBetween('-10 days', '-1 days')
        )->startOfDay()->addHours(rand(6, 10));

        $duration = $this->faker->numberBetween(1, 3);

        $expiresAt = (clone $issuedAt)
            ->addDays($duration)
            ->setTime(20, 0, 0);
        // 📌 returned_at

        if ($expiresAt->lessThanOrEqualTo($issuedAt)) {
            $expiresAt = (clone $issuedAt)->addDay()->setTime(20, 0, 0);
        }
        $returnedAt = null;

        if ($this->faker->boolean(70)) {

            // sometimes return after expiry (late possible)
            $isLate = $this->faker->boolean(40);

            if ($isLate) {
                $returnedAt = (clone $expiresAt)
                    ->addMinutes($this->faker->numberBetween(1, 300));
            } else {
                $returnedAt = Carbon::instance(
                    $this->faker->dateTimeBetween($issuedAt, $expiresAt)
                );
            }
        }

        // =========================
        // LATE LOGIC
        // =========================
        $lateMinutes = 0;
        $returnType = null;

        if ($returnedAt) {

            if ($returnedAt->greaterThan($expiresAt)) {
                $lateMinutes = $expiresAt->diffInMinutes($returnedAt);
                $returnType = 'LATE';
            } else {
                $returnType = 'ON_TIME';
            }
        }

        return [
            'trainee_id' => $this->faker->numberBetween(1, 50),

            'type' => $this->faker->randomElement([
                'LIBERTY',
                'LEAVE',
                'OFFICIAL_BUSINESS',
            ]),

            'mode' => $returnedAt ? 'ABOARD' : 'ASHORE',

            'duration' => $duration,

            'issued_at' => $issuedAt,
            'expires_at' => $expiresAt,
            'returned_at' => $returnedAt,

            // ✅ NEW FIELDS (IMPORTANT)
            'return_type' => $returnType,
            'late_minutes' => $lateMinutes,

            'status' => $returnedAt
                ? 'COMPLETED'
                : ($expiresAt->isPast() ? 'EXPIRED' : 'ACTIVE'),

            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
