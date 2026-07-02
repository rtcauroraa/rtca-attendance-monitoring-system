<?php

namespace App\Http\Controllers;

use App\Models\TraineeMovement;
use App\Models\Trainee;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class TraineeMovementController extends Controller
{
    public function index(Request $request)
    {
        $query = TraineeMovement::with('trainee');
        $trainees = Trainee::all();
        if ($request->search) {
            $search = $request->search;

            $query->whereHas('trainee', function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('middle_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('serial_number', 'like', "%{$search}%")
                    ->orWhere('status', 'like', "%{$search}%")
                    ->orWhere('coy', 'like', "%{$search}%")
                    ->orWhere('emergency_contact_person', 'like', "%{$search}%");
            });
        }

        // ✅ COMPANY FILTER
        if ($request->company && $request->company !== 'all') {
            $query->whereHas('trainee', function ($q) use ($request) {
                $q->where('coy', $request->company);
            });
        }

        $ashorePasses = $query
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('trainee_movement/index', [
            'ashorePasses' => $ashorePasses,
            'trainees' => $trainees,
            'filters' => [
                'search' => $request->search ?? '',
                'company' => $request->company ?? 'all',
            ],
        ]);
    }
    public function  store(Request $request, Trainee $trainee)
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

    public function storeManualBypass(Request $request)
    {
        // 1. Validate incoming data based on the action intent
        $request->validate([
            'trainee_id'       => 'required|exists:trainees,id',
            'action_direction' => 'required|in:GO_ASHORE,RETURN_ABOARD',
            'reason'           => 'required|string|max:255',

            // Required only when configuring a new departure history track
            'type'             => 'required_if:action_direction,GO_ASHORE|in:LIBERTY,LEAVE,OFFICIAL_BUSINESS',
            'issued_at'        => 'required_if:action_direction,GO_ASHORE|date',
            'expires_at'       => 'required_if:action_direction,GO_ASHORE|date|after:issued_at',

            // Accepted for both workflows if managing historical return entry
            'aboard_at'        => 'nullable|date',
        ]);

        $trainee = Trainee::findOrFail($request->trainee_id);
        $user = Auth::user();

        // ==========================================
        // CASE A: DEPARTURE LOGS (GO_ASHORE)
        // ==========================================
        if ($request->action_direction === 'GO_ASHORE') {

            // Block duplicates if they are already logged as active out on the field
            $hasActive = TraineeMovement::where('trainee_id', $trainee->id)
                ->where('status', 'ACTIVE')
                ->exists();

            if ($hasActive) {
                return back()->withErrors([
                    'trainee_id' => "{$trainee->first_name} already has an active Ashore status record."
                ]);
            }

            $issuedAt = Carbon::parse($request->issued_at);
            $expiresAt = Carbon::parse($request->expires_at);

            // Calculates calendar day difference (June 29 to July 1 = 2 days)
            $durationDays = (int) $issuedAt->copy()->startOfDay()->diffInDays($expiresAt->copy()->startOfDay());
            // Check if an actual return timestamp was added via the backlog UI card
            $returnedAt = $request->filled('aboard_at') ? Carbon::parse($request->aboard_at) : null;

            $status = 'ACTIVE';
            $returnType = null;
            $lateMinutes = null;
            $mode = 'ASHORE';

            // If it includes return data, auto-complete the lifecycle block instantly
            if ($returnedAt) {

                $status = 'COMPLETED';
                $mode = 'ABOARD';
                $isLate = $returnedAt->greaterThan($expiresAt);
                $returnType = $isLate ? 'LATE' : 'ON_TIME';
                $lateMinutes = $isLate ? (int) $returnedAt->diffInMinutes($expiresAt) : 0;
            }

            $movement = TraineeMovement::create([
                'trainee_id'   => $trainee->id,
                'type'         => $request->type,
                'mode'         => $mode,
                'duration'     => $durationDays,
                'issued_at'    => $issuedAt,
                'expires_at'   => $expiresAt,
                'returned_at'  => $returnedAt,
                'status'       => $status,
                'return_type'  => $returnType,
                'late_minutes' => $lateMinutes,
            ]);

            // Spatie Activity Tracking
            activity('bypass')
                ->performedOn($movement)
                ->causedBy($user)
                ->withProperty('trainee', "{$trainee->first_name} {$trainee->last_name}")
                ->withProperty('reason', $request->reason)
                ->withProperty('details', [
                    'type' => $request->type,
                    'duration_days' => $durationDays,
                    'status' => $status,
                    'return_type' => $returnType,
                    'backlogged' => true
                ])
                ->log("{$user->name} manually created a historical departure pass ({$status}) for trainee {$trainee->first_name} {$trainee->last_name}.");

            return back()->with('success', "Historical departure pass logged successfully for {$trainee->first_name}.");
        }

        // ==========================================
        // CASE B: CLOSING DEPARTURES (RETURN_ABOARD)
        // ==========================================
        if ($request->action_direction === 'RETURN_ABOARD') {

            if (!$request->filled('aboard_at')) {
                return back()->withErrors(['aboard_at' => 'The actual return timeline date field is required.']);
            }

            // Find open records to resolve
            $activeMovement = TraineeMovement::where('trainee_id', $trainee->id)
                ->where('status', 'ACTIVE')
                ->first();

            if (!$activeMovement) {
                return back()->withErrors([
                    'trainee_id' => "No active 'Ashore' departure log found for {$trainee->first_name}. Please log the departure first."
                ]);
            }

            $returnedAt = Carbon::parse($request->aboard_at);
            $originalExpiration = Carbon::parse($activeMovement->expires_at);

            $isLate = $returnedAt->greaterThan($originalExpiration);
            $lateMinutes = $isLate ? (int) $returnedAt->diffInMinutes($originalExpiration) : 0;

            $activeMovement->update([
                'mode'         => 'ABOARD',
                'returned_at'  => $returnedAt,
                'status'       => 'COMPLETED',
                'return_type'  => $isLate ? 'LATE' : 'ON_TIME',
                'late_minutes' => $lateMinutes,
            ]);

            activity('bypass')
                ->performedOn($activeMovement)
                ->causedBy($user)
                ->withProperty('trainee', "{$trainee->first_name} {$trainee->last_name}")
                ->withProperty('reason', $request->reason)
                ->withProperty('details', [
                    'status' => 'COMPLETED',
                    'return_type' => $isLate ? 'LATE' : 'ON_TIME',
                    'late_minutes' => $lateMinutes,
                    'backlogged' => true
                ])
                ->log("{$user->name} backlogged standalone return timeline (Aboard) for trainee {$trainee->first_name} {$trainee->last_name}.");

            return back()->with('success', "{$trainee->first_name}'s return from paper logs has been successfully recorded.");
        }

        return back()->withErrors(['action_direction' => 'Invalid action routing path executed.']);
    }


    public function storeManualPassesCSV(Request $request)
    {
        $request->validate([
            'csv_file' => 'required|file|mimes:csv,txt|max:4096',
        ]);

        $file = $request->file('csv_file');
        $content = file_get_contents($file->getRealPath());

        // 1. Normalize line endings and split file contents into raw lines
        $content = str_replace("\r\n", "\n", $content);
        $content = str_replace("\r", "\n", $content);
        $rawLines = explode("\n", $content);

        // Filter out completely empty lines
        $rawLines = array_values(array_filter(array_map('trim', $rawLines)));

        if (empty($rawLines)) {
            return back()->withErrors(['csv_file' => 'The uploaded file is empty.']);
        }

        // 2. Define the exact internal keys we are expecting
        $expectedHeaders = ['serial_number', 'action_direction', 'type', 'issued_at', 'expires_at', 'aboard_at', 'reason'];
        $rows = [];

        // 3. Smart Parsing Strategy: Detect layout structure
        // Check if the first line contains commas. If not, it's a line-by-line block file.
        $isCommaSeparated = (strpos($rawLines[0], ',') !== false);

        if ($isCommaSeparated) {
            // Standard CSV Parsing
            $rawHeader = str_getcsv($rawLines[0], ',');
            $header = array_map(function ($item) {
                $item = preg_replace('/^[\xEF\xBB\xBF\xEF\xBF\xBE\xFE\xFF]/', '', $item);
                return strtolower(trim($item));
            }, $rawHeader);

            for ($i = 1; $i < count($rawLines); $i++) {
                $data = str_getcsv($rawLines[$i], ',');
                if (count($header) === count($data)) {
                    $rows[] = array_combine($header, array_map('trim', $data));
                }
            }
        } else {
            // Newline-separated block format (like your paste example)
            // If the first line is exactly 'serial_number', skip it as a header row
            if (strtolower($rawLines[0]) === 'serial_number') {
                array_shift($rawLines);
            }

            // Chunk the remaining elements by 7 (since there are 7 database columns per trainee record)
            $chunks = array_chunk($rawLines, 7);
            foreach ($chunks as $chunk) {
                if (count($chunk) < 7) {
                    // Pad missing trailing values (like a missing reason or aboard_at) with nulls
                    $chunk = array_pad($chunk, 7, null);
                }
                $rows[] = array_combine($expectedHeaders, $chunk);
            }
        }

        // 4. Data Sanitization & Structural Auto-Padding
        foreach ($rows as &$row) {
            foreach ($row as $key => $value) {
                if ($value === null) continue;
                $value = trim($value);

                // Auto-pad single-digit hour timestamps (e.g., "01/07/2026 9:30" -> "01/07/2026 09:30")
                if (in_array($key, ['issued_at', 'expires_at', 'aboard_at']) && !empty($value)) {
                    if (preg_match('/^(\d{2}\/\d{2}\/\d{4})\s+(\d):(\d{2})$/', $value, $matches)) {
                        $value = $matches[1] . ' ' . str_pad($matches[2], 2, '0', STR_PAD_LEFT) . ':' . $matches[3];
                    }
                }

                $row[$key] = ($value === '' || strtolower($value) === 'null' || $value === "\u{A0}") ? null : $value;
            }
        }
        unset($row); // break structural reference pointer

        $user = Auth::user();
        $errors = [];
        $successCount = 0;

        // 5. Database execution transaction loop
        DB::transaction(function () use ($rows, $user, &$errors, &$successCount) {
            foreach ($rows as $index => $row) {
                $rowNumber = $index + 2;

                $validator = Validator::make($row, [
                    'serial_number'    => 'required|exists:trainees,serial_number',
                    'action_direction' => 'required|in:GO_ASHORE,RETURN_ABOARD',
                    'reason'           => 'required|string|max:255',
                    'type'             => 'required_if:action_direction,GO_ASHORE|nullable|in:LIBERTY,LEAVE,OFFICIAL_BUSINESS',
                    'issued_at'        => 'required_if:action_direction,GO_ASHORE|nullable|date_format:d/m/Y H:i',
                    'expires_at'       => 'required_if:action_direction,GO_ASHORE|nullable|date_format:d/m/Y H:i',
                    'aboard_at'        => 'nullable|date_format:d/m/Y H:i',
                ]);

                if ($validator->fails()) {
                    $errors[] = "Row {$rowNumber}: " . implode(', ', $validator->errors()->all());
                    continue;
                }

                $trainee = Trainee::where('serial_number', $row['serial_number'])->first();

                // ==========================================
                // CASE A: GO_ASHORE IMPORT
                // ==========================================
                if ($row['action_direction'] === 'GO_ASHORE') {
                    $hasActive = TraineeMovement::where('trainee_id', $trainee->id)
                        ->where('status', 'ACTIVE')
                        ->exists();

                    if ($hasActive) {
                        $errors[] = "Row {$rowNumber}: Trainee (SN: {$row['serial_number']}) already has an active Ashore status record.";
                        continue;
                    }

                    $issuedAt = Carbon::createFromFormat('d/m/Y H:i', $row['issued_at']);
                    $expiresAt = Carbon::createFromFormat('d/m/Y H:i', $row['expires_at']);

                    $durationDays = (int) $issuedAt->copy()->startOfDay()->diffInDays($expiresAt->copy()->startOfDay());

                    $returnedAt = !empty($row['aboard_at'])
                        ? Carbon::createFromFormat('d/m/Y H:i', $row['aboard_at'])
                        : null;

                    $status = 'ACTIVE';
                    $returnType = null;
                    $lateMinutes = null;
                    $mode = 'ASHORE';

                    if ($returnedAt) {
                        $status = 'COMPLETED';
                        $mode = 'ABOARD';
                        $isLate = $returnedAt->greaterThan($expiresAt);
                        $returnType = $isLate ? 'LATE' : 'ON_TIME';
                        $lateMinutes = $isLate ? (int) $returnedAt->diffInMinutes($expiresAt) : 0;
                    }

                    $movement = TraineeMovement::create([
                        'trainee_id'   => $trainee->id,
                        'type'         => $row['type'],
                        'mode'         => $mode,
                        'duration'     => $durationDays,
                        'issued_at'    => $issuedAt,
                        'expires_at'   => $expiresAt,
                        'returned_at'  => $returnedAt,
                        'status'       => $status,
                        'return_type'  => $returnType,
                        'late_minutes' => $lateMinutes,
                    ]);

                    activity('bypass')
                        ->performedOn($movement)
                        ->causedBy($user)
                        ->withProperty('reason', $row['reason'] . " (via CSV Import)")
                        ->log("CSV Import: Historical departure pass created for SN: {$row['serial_number']}, {$trainee->first_name} {$trainee->last_name}.");

                    $successCount++;
                }

                // ==========================================
                // CASE B: RETURN_ABOARD IMPORT
                // ==========================================
                if ($row['action_direction'] === 'RETURN_ABOARD') {
                    if (empty($row['aboard_at'])) {
                        $errors[] = "Row {$rowNumber}: 'aboard_at' timestamp is required for standalone returns.";
                        continue;
                    }

                    $activeMovement = TraineeMovement::where('trainee_id', $trainee->id)
                        ->where('status', 'ACTIVE')
                        ->first();

                    if (!$activeMovement) {
                        $errors[] = "Row {$rowNumber}: No active 'Ashore' departure log found to resolve for SN: {$row['serial_number']}.";
                        continue;
                    }

                    $returnedAt = Carbon::createFromFormat('d/m/Y H:i', $row['aboard_at']);
                    $originalExpiration = Carbon::parse($activeMovement->expires_at);

                    $isLate = $returnedAt->greaterThan($originalExpiration);
                    $lateMinutes = $isLate ? (int) $returnedAt->diffInMinutes($originalExpiration) : 0;

                    $activeMovement->update([
                        'mode'         => 'ABOARD',
                        'returned_at'  => $returnedAt,
                        'status'       => 'COMPLETED',
                        'return_type'  => $isLate ? 'LATE' : 'ON_TIME',
                        'late_minutes' => $lateMinutes,
                    ]);

                    activity('bypass')
                        ->performedOn($activeMovement)
                        ->causedBy($user)
                        ->withProperty('reason', $row['reason'] . " (via CSV Import)")
                        ->log("CSV Import: Historical return pass completed for SN: {$row['serial_number']}.");

                    $successCount++;
                }
            }
        });

        if (count($errors) > 0) {
            return back()->with('success', "Successfully processed {$successCount} lines.")
                ->withErrors(['csv_file' => $errors]);
        }

        return back()->with('success', "All {$successCount} batch log entries parsed and executed successfully.");
    }
}
