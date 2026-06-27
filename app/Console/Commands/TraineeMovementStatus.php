<?php

namespace App\Console\Commands;

use App\Models\TraineeMovement;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

#[Signature('app:update-ashore-pass-status')]
#[Description('Command description')]
class TraineeMovementStatus extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        TraineeMovement::whereNull('returned_at')
            ->chunkById(200, function ($movements) {
                foreach ($movements as $movement) {
                    $movement->status =
                        $movement->expires_at <= now()
                        ? 'EXPIRED'
                        : 'ACTIVE';

                    $movement->save();
                }
            });
    }
}
