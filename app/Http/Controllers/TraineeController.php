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
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('middle_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('status', 'like', "%{$search}%")
                    ->orWhere('coy', 'like', "%{$search}%")
                    ->orWhere('emergency_contact_person', 'like', "%{$search}%");
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
            'first_name' => ['required', 'string', 'max:255'],

            'middle_name' => ['required', 'string', 'max:255'],

            'last_name' => ['required', 'string', 'max:255'],
            'suffix' => ['required', 'in:N/A,Jr.,Sr.,I,II,III'],

            'birthday' => ['required', 'date', 'before:today'],

            'religion' => ['required', 'string', 'max:100'],

            'contact_no' => ['required', 'string', 'regex:/^[0-9+\-\s]{7,20}$/'],

            'email' => ['required', 'email', 'max:255', 'unique:trainees,email'],

            'status' => ['required', 'in:Single,Married,Widowed'],

            'coy' => ['required', 'in:Alpha,Bravo,Charlie,Delta'],

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

        return back();
    }


    /**
     * Display the specified resource.
     */
    public function show(Trainee $cr)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Trainee $trainee)
    {
        return Inertia::render('trainees/edit-trainee', [
            'trainee' => $trainee,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Trainee $trainee)
    {

        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],

            'middle_name' => ['required', 'string', 'max:255'],

            'last_name' => ['required', 'string', 'max:255'],
            'suffix' => 'required|string',

            'birthday' => 'required|date',
            'religion' => 'required|string',
            'contact_no' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'status' => 'required|string',
            'coy' => 'required|string',
            'address' => 'required|string',

            'emergency_contact_person' => 'required|string|max:255',
            'emergency_contact_no' => 'required|string|max:20',

            'blood_type' => 'required|string|max:5',
            'height' => 'required|integer',
            'weight' => 'required|integer',

            'identifying_marks' => 'required|string',
            'eye_color' => 'required|string',
            'hair_color' => 'required|string',
        ]);

        $trainee->update($validated);

        return back();
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Trainee $trainee)
    {
        try {
            $trainee->delete();

            return redirect()
                ->route('trainees.index')
                ->with('success', 'Trainee deleted successfully.');
        } catch (\Throwable $e) {
            report($e);

            return back()->with('error', 'Failed to delete trainee.');
        }
    }

    public function storeCSV(Request $request)
    {
        $request->validate([
            'csv_file' => 'required|file|mimes:csv,txt|max:10240',
        ]);

        // Fix for servers reading files with Mac/Windows mixed line-endings
        ini_set('auto_detect_line_endings', true);

        $file = $request->file('csv_file');
        $filePath = $file->getRealPath();

        if (($handle = fopen($filePath, 'r')) !== false) {

            // 1. Read the very first row as headers and clean them up
            $rawHeaders = fgetcsv($handle, 0, ',');

            if (!$rawHeaders) {
                fclose($handle);
                return redirect()->back()->withErrors(['csv_file' => 'The CSV file is empty or unreadable.']);
            }

            // Normalize headers: lowercase, remove spaces, trim whitespace
            $headers = array_map(function ($header) {
                return strtolower(str_replace([' ', '_', '-'], '', trim($header)));
            }, $rawHeaders);

            $batch = [];
            $now = now();

            // 2. Loop through each subsequent data row
            while (($row = fgetcsv($handle, 0, ',')) !== false) {

                // Skip empty lines or trailing rows
                if (empty(array_filter($row))) {
                    continue;
                }

                // Pad or slice row array to match the header length perfectly
                if (count($row) < count($headers)) {
                    $row = array_pad($row, count($headers), null);
                } elseif (count($row) > count($headers)) {
                    $row = array_slice($row, 0, count($headers));
                }

                // Combine headers with row values safely
                $rowData = array_combine($headers, $row);

                // 3. Extract email safely (adjust the key if your CSV header is named differently)
                $email = isset($rowData['email']) ? trim($rowData['email']) : null;

                // Skip row if email is blank or invalid to avoid database unique constraint crashes
                if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    continue;
                }

                // 4. Combine First Name and Last Name if they are separate columns in your CSV




                // 5. Structure fields to match your trainees table migration layout
                $batch[] = [
                    'first_name'                     => $rowData['firstname'] ?? null,
                    'middle_name'                     => $rowData['middlename'] ?? null,
                    'last_name'                     => $rowData['lastname'] ?? null,
                    'suffix'                     => $rowData['suffix'] ?? null,
                    'birthday'                 => !empty($rowData['birthday']) ? date('Y-m-d', strtotime($rowData['birthday'])) : null,
                    'religion'                 => $rowData['religion'] ?? null,
                    'contact_no'               => $rowData['contactno'] ?? $rowData['contactnumber'] ?? null,
                    'email'                    => $email,
                    'status'                   => $rowData['status'] ?? null,
                    'coy'                   => $rowData['coy'] ?? null,
                    'address'                  => $rowData['address'] ?? null,
                    'emergency_contact_person' => $rowData['emergencycontactperson'] ?? null,
                    'emergency_contact_no'     => $rowData['emergencycontactno'] ?? null,
                    'blood_type'               => $rowData['bloodtype'] ?? null,
                    'height'                   => $rowData['heightcm'] ?? $rowData['height'] ?? null,
                    'weight'                   => $rowData['weightkg'] ?? $rowData['weight'] ?? null,
                    'identifying_marks'        => $rowData['identifyingmarks'] ?? null,
                    'eye_color'                => $rowData['eyecolor'] ?? null,
                    'hair_color'               => $rowData['haircolor'] ?? null,
                    'created_at'               => $now,
                    'updated_at'               => $now,
                ];

                // Save to database in chunks of 500 rows to keep server memory usage low
                if (count($batch) >= 500) {
                    Trainee::insert($batch);
                    $batch = [];
                }
            }

            // Save remaining trailing entries
            if (!empty($batch)) {
                Trainee::insert($batch);
            }

            fclose($handle);
        }

        return redirect()->back();
    }
}
