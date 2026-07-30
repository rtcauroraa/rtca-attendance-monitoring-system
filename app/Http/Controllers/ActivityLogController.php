<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $query = Activity::query()->with('causer');

        if ($request->search) {
            $query->where('description', 'like', "%{$request->search}%");
        }

        if ($request->module && $request->module !== 'all') {
            $query->where('log_name', $request->module);
        }

        if ($request->user) {
            $query->whereHas('causer', function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->user}%");
            });
        }

        $logs = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('activity-logs/index', [
            'logs' => $logs,
            'filters' => [
                'search' => $request->search ?? '',
                'module' => $request->module ?? 'all', // Fallback directly to 'all' for perfect dropdown mapping
                'user' => $request->user ?? '',
            ]
        ]);
    }
}
