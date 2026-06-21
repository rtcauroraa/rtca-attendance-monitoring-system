<?php

namespace App\Http\Controllers;

use App\Models\AshoreAboardPass;
use App\Models\Trainee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AshoreAboardPassesController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->search;

        $ashorePasses = AshoreAboardPass::with('trainee')
            ->when($search, function ($query) use ($search) {
                $query->whereHas('trainee', function ($q) use ($search) {
                    $q->where('first_name', 'like', "%{$search}%")
                        ->orWhere('middle_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('coy', 'like', "%{$search}%")
                        ->orWhere('status', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->get();

        return Inertia::render('ashoreaboard-passes/index', [
            'ashorePasses' => $ashorePasses,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function store(Request $request, Trainee $trainee)
    {
        $request->validate([
            'duration' => 'required|integer',
            'time' => 'required|string',
        ]);

        if (!str_contains($request->time, ':')) {
            return back()->withErrors([
                'ashore' => 'Invalid time format',
            ]);
        }

        $active = AshoreAboardPass::where('trainee_id', $trainee->id)
            ->where('status', 'active')
            ->first();

        if ($active && now()->lte($active->expires_at)) {
            return back()->withErrors([
                'ashore' => 'Trainee already has an active ashore pass.',
            ]);
        }

        [$hour, $minute] = explode(':', $request->time);

        $expiresAt = now()
            ->addDays((int) $request->duration)
            ->setTime($hour, $minute, 0);

        DB::transaction(function () use ($trainee, $request, $expiresAt) {
            AshoreAboardPass::create([
                'trainee_id' => $trainee->id,
                'duration_days' => $request->duration,
                'issued_at' => now(),
                'expires_at' => $expiresAt,
                'status' => 'active',
            ]);
        });

        return back()->with('success', 'Ashore pass created successfully');
    }

    public function updateToAboard(Request $request, Trainee $trainee)
    {
        $pass = AshoreAboardPass::where('trainee_id', $trainee->id)
            ->where('status', 'active')
            ->whereNull('aboard_at')
            ->latest()
            ->first();

        if (!$pass) {
            return back()->withErrors([
                'ashore' => 'No active ashore pass found for this trainee.',
            ]);
        }

        $pass->update([
            'aboard_at' => now(),
            'status' => 'aboard',
        ]);

        return back()->with('success', 'Trainee successfully marked as aboard.');
    }
}
