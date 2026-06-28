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
    return Inertia::render('dashboard', [
        'totalTrainees' => $totalTrainees,
        'activePasses' => $activePasses,
           'completedPasses' => $completedPasses,
               'totalMinutesLate' => $totalMinutesLate,
    ]);
       
    }
}