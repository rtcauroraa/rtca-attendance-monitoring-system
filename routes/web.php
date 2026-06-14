<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\PersonnelController;
use App\Http\Controllers\TraineeController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('user', 'users/user')->name('user');
    Route::inertia('create-user', 'users/create-user')->name('create-user');
    Route::inertia('create-trainee', 'trainees/create-trainee')->name('create-trainee');

    Route::resource('personnels', PersonnelController::class);

    Route::post('/trainees', [TraineeController::class, 'store'])
        ->name('trainees.store');
    Route::get('/trainees', [TraineeController::class, 'index'])
<<<<<<< HEAD
        ->name('trainees');
    Route::get('/trainees/{trainee}/edit', [TraineeController::class, 'edit'])
        ->name('trainees-edit');
    Route::put('/trainees/{trainee}/update', [TraineeController::class, 'update'])
        ->name('trainees-update');
    Route::delete('/trainees/{trainee}/delete', [TraineeController::class, 'destroy'])
        ->name('trainees.destroy');
    Route::post('/import-trainees', [TraineeController::class, 'storeCSV']);
=======
    ->name('trainees');
    
    // Attendance 
     Route::inertia('attendance', 'attendance/attendance')->name('attendance');
     Route::inertia('create-attendance', 'attendance/create-attendance')->name('create-attendance');
>>>>>>> 1a04b356bbe93110ed4ff4fa457bffaec372a368
});

require __DIR__ . '/settings.php';
