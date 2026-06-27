<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TraineeMovement extends Model
{
    use HasFactory;
    protected $fillable = [
        'trainee_id',
        'type',          // LIBERTY | LEAVE | OFFICIAL_BUSINESS
        'mode',          // ASHORE | ABOARD
        'duration',
        'time',          // planned return time (optional but useful)
        'issued_at',
        'expires_at',
        'returned_at',
        'return_type',
        'late_minutes',
        'status',
    ];

    public function trainee()
    {
        return $this->belongsTo(Trainee::class);
    }
    protected $casts = [
        'issued_at' => 'datetime:d Hi\H F Y',
        'expires_at' => 'datetime:d Hi\H F Y',
        'returned_at' => 'datetime:d Hi\H F Y',
    ];




    public function markAsReturned(): void
    {
        $this->update([
            'mode' => 'ABOARD',
            'returned_at' => now(),
            'status' => 'COMPLETED',
        ]);
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

    protected static function booted()
    {
        static::retrieved(function ($movement) {
            if (
                $movement->status === 'ACTIVE' &&
                $movement->expires_at &&
                now()->greaterThan($movement->expires_at) &&
                !$movement->returned_at
            ) {
                $movement->status = 'EXPIRED';
            }
        });
    }
}
