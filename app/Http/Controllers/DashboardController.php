<?php

namespace App\Http\Controllers;

use App\Models\Trainee;

use App\Models\TraineeMovement;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalTrainees = Trainee::count();
        $activePasses = TraineeMovement::with('trainee')
            ->where('status', 'ACTIVE')
            ->where('mode', 'ASHORE') // optional if you only mean ashore passes
            ->count(); // or ->get() if you need list
        $completedPasses = TraineeMovement::with('trainee')
            ->where('status', 'COMPLETED')

            ->count(); // or ->get() if you need list
        $totalMinutesLate = TraineeMovement::sum('late_minutes');
        $recentActivity = TraineeMovement::with('trainee:id,first_name,last_name')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($movement) {
                return [
                    'id' => $movement->id,
                    'name' => optional($movement->trainee)->first_name . ' ' . optional($movement->trainee)->last_name,
                    'mode' => $movement->mode,
                    'type' => $movement->type,
                    'duration' => $movement->duration,
                    'issued_at' => $movement->created_at->toISOString(), // Sends "2026-07-02T08:06:19.000000Z"
                    'expires_at' => $movement->expires_at ? $movement->expires_at->toISOString() : null,


                    'returned_at' => $movement->returned_at ? $movement->returned_at->toISOString() : null, // Sends "2026-07-02T08:06:19.000000Z"
                    'return_type' => $movement->return_type,
                    'late_minutes' => $movement->late_minutes,
                    'status' => $movement->status,
                ];
            });

        // 2. Tally current active passes grouped by their movement authorization type
        $passCounts = TraineeMovement::where('status', 'ACTIVE')
            ->selectRaw("SUM(CASE WHEN type = 'LIBERTY' THEN 1 ELSE 0 END) as `liberty`")
            ->selectRaw("SUM(CASE WHEN type = 'LEAVE' THEN 1 ELSE 0 END) as `leave`")
            ->selectRaw("SUM(CASE WHEN type = 'OFFICIAL_BUSINESS' THEN 1 ELSE 0 END) as `official_business`")
            ->first();



        return Inertia::render('dashboard', [
            'totalTrainees' => $totalTrainees,
            'activePasses' => $activePasses,
            'completedPasses' => $completedPasses,
            'totalMinutesLate' => $totalMinutesLate,
            'recentActivity' => $recentActivity,
            'passBreakdown' => [
                'liberty' => (int) ($passCounts->liberty ?? 0),
                'leave' => (int) ($passCounts->leave ?? 0),
                'official_business' => (int) ($passCounts->official_business ?? 0),
            ]
        ]);
    }
}
