<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Trainee extends Model
{
  protected $fillable = [
        'name',
        'birthday',
        'religion',
        'contact_no',
        'email',
        'status',
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
}
