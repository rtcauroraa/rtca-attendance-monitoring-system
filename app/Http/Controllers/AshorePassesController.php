<?php

namespace App\Http\Controllers;

use App\Models\AshorePass;
use App\Models\AshorePasses;
use App\Models\Trainee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AshorePassesController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->search;

        $ashorePasses = AshorePass::with('trainee')
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

        return Inertia::render('ashore-passes/index', [
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

        $active = AshorePass::where('trainee_id', $trainee->id)
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
            AshorePass::create([
                'trainee_id' => $trainee->id,
                'duration_days' => $request->duration,
                'issued_at' => now(),
                'expires_at' => $expiresAt,
                'status' => 'active',
            ]);
        });

        return back()->with('success', 'Ashore pass created successfully');
    }
}
