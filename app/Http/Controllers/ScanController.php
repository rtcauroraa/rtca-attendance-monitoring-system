<?php

namespace App\Http\Controllers;

use App\Models\Personnel;
use App\Models\Trainee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ScanController extends Controller
{
    public function qr_code($type, $qr_code)
{

        $person = Trainee::with([
            'movements' => fn ($query) => $query->latest()
        ])
        ->where('serial_number', $qr_code)
        ->first();

    if (!$person) {
        return back()->withErrors([
            'qr_code' => 'Trainee Not Found.',
        ]);
    }


    return Inertia::render('scanner', [
        'data' => $person,
        'type' => $type,
    ]);
}
}
