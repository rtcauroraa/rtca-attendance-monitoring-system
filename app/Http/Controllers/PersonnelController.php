<?php

namespace App\Http\Controllers;

use App\Models\Personnel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PersonnelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //   return Inertia::render('personnel/index', [
        //     'personnels' => Personnel::latest()->get(),
        // ]);

        $query = Personnel::query();
        // $personnels = Personnel::latest()->get();

        // ✅ SERVER-SIDE SEARCH
        if ($request->search) {
            $query = Personnel::query();
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                    ->orWhere('email', 'like', "%{$request->search}%")
                    ->orWhere('contact_no', 'like', "%{$request->search}%");
            });      
        }

        $personnels = $query
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        
        return Inertia::render('personnel/index', [
            'personnels' => $personnels,
            'filters' => [
                'search' => $request->search ?? '',
            ],
        ]);

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('personnel/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
         $validated = $request->validate([
            'rank' => ['required'],
            'lastname' => ['required'],
            'firstname' => ['required'],
            'middlename' => ['required'],
            'suffix' => ['required'],
            'serialno' => ['required'],
            'email' => ['required'],
            'duty_status' => ['required'],
            'primary_designation' => ['required'],
            'other_designation' => ['required'],
            'date_of_last_promotion' => ['required'],
            'date_entered_service' => ['required'],
            'date_enlisted_or_commissioned' => ['required'],
        ]);
        Personnel::create($validated);
        
        return redirect()->route('personnels.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Personnel $personnel)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Personnel $personnel)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Personnel $personnel)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Personnel $personnel)
    {
         $personnel->delete();

        return redirect()->route('personnels.index');
    }
}
