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
        if ($type === 'Trainee') {
            $person = Trainee::where('serial_number', $qr_code)->firstOrFail();
        } elseif ($type === 'Personnel') {
            $person = Personnel::where('serial_number', $qr_code)->firstOrFail();
        } else {
            abort(404);
        }

        return Inertia::render('scanner', [
            'data' => $person,
            'type' => $type,
        ]);
    }
}
