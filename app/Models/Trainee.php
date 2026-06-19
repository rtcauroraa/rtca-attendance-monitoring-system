<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Trainee extends Model
{
    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'serial_number',
        'qr_code',
        'suffix',
        'birthday',
        'religion',
        'contact_no',
        'email',
        'status',
        'coy',
        'address',
        'emergency_contact_person',
        'emergency_contact_no',
        'blood_type',
        'height',
        'weight',
        'identifying_marks',
        'eye_color',
        'hair_color',
    ];

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function ashorePasses(): HasOne
    {
        return $this->hasOne(AshorePass::class)
            ->where('status', 'active')
            ->latestOfMany();
    }
}
