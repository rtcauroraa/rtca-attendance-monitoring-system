<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AshoreAboardPass extends Model
{
    protected $fillable = [
        'trainee_id',
        'duration_days',
        'issued_at',
        'expires_at',
        'aboard_at',
        'status',
    ];

    protected $casts = [
        'issued_at' => 'datetime:d Hi\H F Y',
        'expires_at' => 'datetime:d Hi\H F Y',
    ];

    public function trainee(): BelongsTo
    {
        return $this->belongsTo(Trainee::class);
    }

    public function isExpired(): bool
    {
        return now()->gt($this->expires_at);
    }



    public function isActive(): bool
    {
        return $this->status === 'active'
            && now()->lte($this->expires_at);
    }
}
