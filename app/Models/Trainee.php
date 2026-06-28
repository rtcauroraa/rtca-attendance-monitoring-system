<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Trainee extends Model
{
<<<<<<< HEAD
  protected $fillable = [
        'lastname',
        'firstname',
        'middlename',
=======
    use HasFactory;

    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'serial_number',
        'qr_code',
>>>>>>> e1996f8e47627489a595d914fd97118e2ae933b6
        'suffix',
        'birthday',
        'religion',
        'contact_no',
        'email',
        'status',
        'coy',
        'address',
        'company',
        'emergency_contact_person',
        'emergency_contact_no',
        'blood_type',
        'height',
        'weight',
        'identifying_marks',
        'eye_color',
        'hair_color',
    ];

    public function movements()
    {
        return $this->hasMany(TraineeMovement::class);
    }
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
