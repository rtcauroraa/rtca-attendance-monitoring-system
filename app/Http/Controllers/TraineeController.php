<?php

namespace App\Http\Controllers;

use App\Models\Trainee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class TraineeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Trainee::query();

        // ✅ SERVER-SIDE SEARCH
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                    ->orWhere('email', 'like', "%{$request->search}%")
                    ->orWhere('contact_no', 'like', "%{$request->search}%");
            });
        }

        $trainees = $query
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('trainees/trainees', [
            'trainees' => $trainees,
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
        //  return Inertia::render('/create-trainee');
    }

    /**
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],

            'birthday' => ['required', 'date', 'before:today'],

            'religion' => ['required', 'string', 'max:100'],

            'contact_no' => ['required', 'string', 'regex:/^[0-9+\-\s]{7,20}$/'],

            'email' => ['required', 'email', 'max:255', 'unique:trainees,email'],

            'status' => ['required', 'in:Single,Married,Widowed'],

            'address' => ['required', 'string', 'max:500'],

            'emergency_contact_person' => ['required', 'string', 'max:255'],

            'emergency_contact_no' => ['required', 'string', 'regex:/^[0-9+\-\s]{7,20}$/'],

            'blood_type' => ['required', 'in:A,A+,B,B+,AB,O,O+'],

            'height' => ['required', 'numeric', 'min:50', 'max:300'],

            'weight' => ['required', 'numeric', 'min:10', 'max:500'],

            'identifying_marks' => ['required', 'string', 'max:255'],

            'eye_color' => ['required', 'string', 'max:50'],

            'hair_color' => ['required', 'string', 'max:50'],
        ]);

        Trainee::create($validated);

        return back()->with('success', 'Trainee created successfully!');
    }


    /**
     * Display the specified resource.
     */
    public function show(cr $cr)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(cr $cr)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, cr $cr)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(cr $cr)
    {
        //
    }
}
