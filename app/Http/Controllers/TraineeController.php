<?php

namespace App\Http\Controllers;


use App\Models\Attendance;
use App\Models\Trainee;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\Label\LabelAlignment;
use Endroid\QrCode\Label\Font\OpenSans;
use Endroid\QrCode\RoundBlockSizeMode;
use Endroid\QrCode\Writer\PngWriter;
use Illuminate\Support\Facades\Storage;

class TraineeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Trainee::query();

        // ✅ SEARCH
        if ($request->search) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('middle_name', 'like', "%{$search}%")
                    ->orWhere('serial_number', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('status', 'like', "%{$search}%")
                    ->orWhere('coy', 'like', "%{$search}%")
                    ->orWhere('emergency_contact_person', 'like', "%{$search}%");
            });
        }

        // ✅ COMPANY FILTER (ADD THIS)
        if ($request->company && $request->company !== 'all') {
            $query->where('coy', $request->company);
        }

        $trainees = $query
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('trainees/trainees', [
            'trainees' => $trainees,
            'filters' => [
                'search' => $request->search ?? '',
                'company' => $request->company ?? 'all', // ✅ ADD THIS
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

            'serial_number' => ['required', 'string', 'max:255'],

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

        $builder = new Builder(
            writer: new PngWriter(),
            writerOptions: [],
            validateResult: false,
            data: 'Trainee_' . $validated['serial_number'],
            encoding: new Encoding('UTF-8'),
            errorCorrectionLevel: ErrorCorrectionLevel::High,
            size: 300,
            margin: 10,
            roundBlockSizeMode: RoundBlockSizeMode::Margin,
            logoPath: public_path('rtc-aurora-logo'),
            logoResizeToWidth: 50,
            logoPunchoutBackground: true,
            labelText: $validated['serial_number'],
            labelFont: new OpenSans(20),
            labelAlignment: LabelAlignment::Center
        );

        $result = $builder->build();

        $filename = 'qrcodes/PCG-Class-119/' . $validated['serial_number'] . '.png';

        Storage::disk('public')->put(
            $filename,
            $result->getString()
        );

        Trainee::create([
            ...$validated,
            'qr_code' => $filename, // SAVE TO DB
        ]);
        return back();
    }

    public function import(Request $request)
    {
        // 1. Validate that the uploaded file is indeed a CSV
        $request->validate([
            'csv_file' => 'required|file|mimes:csv,txt|max:2048',
        ]);

        // 2. Retrieve the file
        $file = $request->file('csv_file');

        // 3. Parse the CSV using PHP's native fgetcsv
        if (($handle = fopen($file->getRealPath(), 'r')) !== false) {
            // Skip the header row if your CSV has one
            fgetcsv($handle);

            while (($row = fgetcsv($handle)) !== false) {
                // Map columns and insert/update your Trainee model
                $fullname = $row[0] . " " . $row[1] . " " . $row[2];

                Trainee::create([
                    'lastname' => $row[0],
                    'firstname' => $row[1],
                    'middlename' => $row[2],
                    'suffix' => $row[3],
                    'birthday' => $row[4],
                    'religion' => $row[5],
                    'address' => $row[6],
                    'contact_no' => $row[7],
                    'emergency_contact_person' => $row[8],
                    'email' => $row[9],
                    'emergency_contact_no' =>  $row[7],
                    'status' => $row[10],
                    'company' => $row[11],
                    'blood_type' =>  $row[12],
                    'height' =>  $row[13],
                    'weight' =>  $row[14],
                    'identifying_marks' => $row[15],
                    'eye_color' => $row[16],
                    'hair_color' => $row[17],
                ]);
            }
            fclose($handle);
        }

        // 4. Return an appropriate Inertia response or redirect
        return redirect()->back()->with('success', 'Trainees imported successfully.');
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
            'serial_number' => ['required', 'string', 'max:255'],
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


        ini_set('auto_detect_line_endings', true);

        $file = $request->file('csv_file');
        $filePath = $file->getRealPath();



        if (($handle = fopen($filePath, 'r')) !== false) {

            // 1. Headers
            $rawHeaders = fgetcsv($handle, 0, ',');

            if (!$rawHeaders) {
                fclose($handle);
                return redirect()->back()->withErrors(['csv_file' => 'The CSV file is empty or unreadable.']);
            }

            // Clean hidden Byte Order Marks (BOM) and sanitize strings
            $headers = array_map(function ($header) {
                $clean = preg_replace('/[\x{FEFF}\x{200B}-\x{200D}]/u', '', $header); // Strips hidden BOM characters
                return strtolower(str_replace([' ', '_', '-'], '', trim($clean)));
            }, $rawHeaders);

            // Debug fallback helper: If it fails, tells you exactly what headers PHP registered
            if (!in_array('serialnumber', $headers)) {
                fclose($handle);
                return redirect()->back()->withErrors([
                    'csv_file' => 'Missing column "serial_number". Detected headers were: ' . implode(', ', $headers)
                ]);
            }

            $batch = [];
            $skippedRows = [];
            $lineNumber = 1;
            $processedCount = 0;
            $now = now();

            // 2. Preload existing serials
            $existingSerials = Trainee::pluck('serial_number')->filter()->toArray();
            $existingSerials = array_flip($existingSerials);

            while (($row = fgetcsv($handle, 0, ',')) !== false) {
                $lineNumber++;

                // Ignore completely blank rows
                if (empty(array_filter($row))) {
                    continue;
                }

                // Standardize row size dynamically based on layout count
                $headerCount = count($headers);
                $rowCount = count($row);

                if ($rowCount < $headerCount) {
                    $row = array_pad($row, $headerCount, null);
                } elseif ($rowCount > $headerCount) {
                    $row = array_slice($row, 0, $headerCount);
                }

                $rowData = array_combine($headers, $row);
                $processedCount++;

                // 3. Serial Verification
                $serial = isset($rowData['serialnumber']) ? trim($rowData['serialnumber']) : null;
                if (empty($serial)) {
                    $skippedRows[] = "Row {$lineNumber}: Missing serial number.";
                    continue;
                }

                // 4. Duplicate Check
                if (isset($existingSerials[$serial])) {
                    $skippedRows[] = "Row {$lineNumber} (Serial: {$serial}): Serial number already exists in database.";
                    continue;
                }

                // Last Name Check
                $lastName = isset($rowData['lastname']) ? trim($rowData['lastname']) : null;
                if (empty($lastName)) {
                    $skippedRows[] = "Row {$lineNumber} (Serial: {$serial}): Last name column is empty.";
                    continue;
                }

                // 5. Email Verification
                $email = isset($rowData['email']) ? trim($rowData['email']) : null;
                if (empty($email)) {
                    $skippedRows[] = "Row {$lineNumber} (Serial: {$serial}): Email column is empty.";
                    continue;
                }
                if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    $skippedRows[] = "Row {$lineNumber} (Serial: {$serial}): Invalid email address structure ('{$email}').";
                    continue;
                }

                // 6. QR Generation Safeguard
                $filename = 'qrcodes/PCG-Class-119/' . $serial . '.png';
                try {
                    $builder = new Builder(
                        writer: new PngWriter(),
                        writerOptions: [],
                        validateResult: false,
                        data: 'Trainee_' . $serial,
                        encoding: new Encoding('UTF-8'),
                        errorCorrectionLevel: ErrorCorrectionLevel::High,
                        size: 300,
                        margin: 10,
                        roundBlockSizeMode: RoundBlockSizeMode::Margin,
                        logoPath: public_path('rtc-aurora-logo.png'),
                        logoResizeToWidth: 50,
                        logoPunchoutBackground: true,
                        labelFont: new OpenSans(20),
                        labelAlignment: LabelAlignment::Center
                    );

                    $result = $builder->build();
                    Storage::disk('public')->put($filename, $result->getString());
                } catch (\Exception $e) {
                    $skippedRows[] = "Row {$lineNumber} (Serial: {$serial}): QR generation dropped. Reason: " . $e->getMessage();
                    continue;
                }

                // Normalize Contact Numbers safely
                $contactNo = trim($rowData['contactno'] ?? $rowData['contactnumber'] ?? '');
                if (!empty($contactNo)) {
                    $contactNo = preg_replace('/\D/', '', $contactNo);
                    if (!str_starts_with($contactNo, '0')) {
                        $contactNo = '0' . $contactNo;
                    }
                }

                $emergencyContactNo = trim($rowData['emergencycontactno'] ?? '');
                if (!empty($emergencyContactNo)) {
                    $emergencyContactNo = preg_replace('/\D/', '', $emergencyContactNo);
                    if (!str_starts_with($emergencyContactNo, '0')) {
                        $emergencyContactNo = '0' . $emergencyContactNo;
                    }
                }

                // 7. Push to Array Collection
                $batch[] = [
                    'first_name'               => $rowData['firstname'] ?? null,
                    'middle_name'              => $rowData['middlename'] ?? null,
                    'last_name'                => $lastName,
                    'serial_number'            => $serial,
                    'suffix'                   => $rowData['suffix'] ?? null,
                    'birthday'                 => !empty($rowData['birthday']) ? date('Y-m-d', strtotime($rowData['birthday'])) : null,
                    'religion'                 => $rowData['religion'] ?? null,
                    'contact_no'               => $contactNo,
                    'email'                    => $email,
                    'status'                   => $rowData['status'] ?? null,
                    'coy'                      => $rowData['coy'] ?? null,
                    'address'                  => $rowData['address'] ?? null,
                    'emergency_contact_person' => $rowData['emergencycontactperson'] ?? $rowData['emergency_contact_person'] ?? null,
                    'emergency_contact_no'     => $emergencyContactNo,
                    'blood_type'               => $rowData['bloodtype'] ?? null,
                    'height'                   => $rowData['heightcm'] ?? $rowData['height'] ?? null,
                    'weight'                   => $rowData['weightkg'] ?? $rowData['weight'] ?? null,
                    'identifying_marks'        => $rowData['identifyingmarks'] ?? $rowData['identifying'] ?? null,
                    'eye_color'                => $rowData['eyecolor'] ?? null,
                    'hair_color'               => $rowData['haircolor'] ?? null,
                    'qr_code'                  => $filename,
                    'created_at'               => $now,
                    'updated_at'               => $now,
                ];

                $existingSerials[$serial] = true;

                // 8. Chunk Processor
                if (count($batch) >= 500) {
                    Trainee::insert($batch);
                    $batch = [];
                }
            }

            // Final Leftover Save
            if (!empty($batch)) {
                Trainee::insert($batch);
            }

            fclose($handle);

            // Ultimate Fallback: If code executed but completely bypassed the loop processing lines
            if ($processedCount === 0) {
                return redirect()->back()->withErrors([
                    'csv_file' => 'The file structure was parsed, but 0 valid rows were processed. Check line formatting.'
                ]);
            }
        }



        if (!empty($skippedRows)) {
            return redirect()->back()->with([
                'success' => 'Import completed with some skipped exceptions.',
                'skipped' => $skippedRows
            ]);
        }

        return redirect()->back()->with('success', 'All records imported successfully!');
    }

    public function downloadQrPdf(Request $request)
    {
        $query = Trainee::query();

        // ONLY COMPANY FILTER
        if ($request->company && $request->company !== 'all') {
            $query->where('coy', $request->company); // or company_id if applicable
        }

        $trainees = $query->get();
        $pdf = Pdf::loadView('pdf.qr-codes', [
            'trainees' => $trainees,
        ]);
        $fileName = 'qr-codes-' . $request->company . '' . '-' . now()->format('Y-m-d') . '.pdf';

        return $pdf->download($fileName);
    }
}
