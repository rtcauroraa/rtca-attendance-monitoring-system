<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    public function trainee()
    {
        return $this->belongsTo(Trainee::class);
    }
}
