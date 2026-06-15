<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Trainee extends Model
{
  protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
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
}
