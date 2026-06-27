<?php

namespace App\Http\Controllers;

use App\Models\TraineeMovement;
use App\Models\Trainee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TraineeMovementController extends Controller
{
    public function index(Request $request)
    {

        $search = $request->search;

        $ashorePasses = TraineeMovement::with('trainee')
            ->when($search, function ($query) use ($search) {
                $query->whereHas('trainee', function ($q) use ($search) {
                    $q->where('first_name', 'like', "%{$search}%")
                        ->orWhere('middle_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('coy', 'like', "%{$search}%")
                        ->orWhere('status', 'like', "%{$search}%");
                });
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();




        return Inertia::render('trainee_movement/index', [
            'ashorePasses' => $ashorePasses,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }
    public function store(Request $request, Trainee $trainee)
    {
        $validated = $request->validate([
            'type' => 'required|in:LIBERTY,LEAVE,OFFICIAL_BUSINESS',
            'mode' => 'required|in:ASHORE,ABOARD',
            'duration' => 'nullable|integer',
            'time' => 'nullable|string',
        ]);


        /*
    |--------------------------------------------------------------------------
    | ASHORE (ISSUE PASS)
    |--------------------------------------------------------------------------
    */
        if ($validated['mode'] === 'ASHORE') {
            if (!isset($validated['duration']) || $validated['duration'] === null || $validated['time'] === null) {
                return back()->withErrors([
                    'ashore' => 'Duration and time are required.',
                ]);
            }

            if (!str_contains($validated['time'], ':')) {
                return back()->withErrors([
                    'ashore' => 'Invalid time format',
                ]);
            }

            // prevent active pass
            $active = TraineeMovement::where('trainee_id', $trainee->id)
                ->where('status', 'ACTIVE')
                ->whereNull('returned_at')
                ->first();

            if ($active) {
                return back()->withErrors([
                    'ashore' => 'Already has active pass.',
                ]);
            }

            [$hour, $minute] = explode(':', $validated['time']);

            $expiresAt = now()
                ->addDays((int) $validated['duration'])
                ->setTime($hour, $minute, 0);

            TraineeMovement::create([
                'trainee_id' => $trainee->id,
                'type' => $validated['type'],
                'mode' => 'ASHORE',

                'duration' => $validated['duration'],
                'issued_at' => now(),
                'expires_at' => $expiresAt,

                'status' => 'ACTIVE',
            ]);

            return back()->with('success', 'Ashore pass created.');
        }

        /*
    |--------------------------------------------------------------------------
    | ABOARD (RETURN / CHECK-IN)
    |--------------------------------------------------------------------------
    */
        if ($validated['mode'] === 'ABOARD') {

            $movement = TraineeMovement::where('trainee_id', $trainee->id)
                ->whereNull('returned_at')
                ->whereIn('status', ['ACTIVE', 'EXPIRED'])
                ->latest()
                ->first();

            if (!$movement) {
                return back()->withErrors([
                    'noMovement' => 'No active pass found.',
                ]);
            }

            $now = now();

            // ensure expires_at exists and is a Carbon instance
            $expiresAt = $movement->expires_at ? \Carbon\Carbon::parse($movement->expires_at) : null;

            $isLate = $expiresAt ? $now->gt($expiresAt) : false;

            $lateMinutes = 0;

            if ($isLate) {
                // difference should be now - expires_at
                $lateMinutes = $expiresAt->diffInMinutes($now);
            }

            $movement->update([
                'returned_at' => $now,
                'status' => 'COMPLETED',
                'return_type' => $isLate ? 'LATE' : 'ON_TIME',
                'late_minutes' => $lateMinutes,
            ]);

            return back()->with('success', 'Trainee returned successfully.');
        }
    }
}
