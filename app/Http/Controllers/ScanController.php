<?php

namespace App\Http\Controllers;

use App\Models\Personnel;
use App\Models\Trainee;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ScanController extends Controller
{
    public function qr_code($type, $qr_code)
    {
        $user = Auth::user();
        $person = Trainee::with([
            'movements' => fn($query) => $query->latest(),
        ])
            ->where('serial_number', $qr_code)
            ->where('coy', $user->role) // Must match the user's role
            ->first();

        if (!$person) {
            return back()->withErrors([
                'qr_code' => 'You are not authorized to scan this trainee.',
            ]);
        }

        return Inertia::render('trainee_movement/scanner', [
            'data' => $person,
            'type' => $type,
        ]);
    }
}
