<?php

namespace App\Console\Commands;

use App\Models\AshorePass;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

#[Signature('app:update-ashore-pass-status')]
#[Description('Command description')]
class UpdateAshorePassStatus extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        AshorePass::query()->update([
            'status' => DB::raw("
            CASE 
                WHEN expires_at < NOW() THEN 'expired'
                ELSE 'active'
            END
        ")
        ]);
    }
}
