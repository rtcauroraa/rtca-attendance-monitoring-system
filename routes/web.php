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
    ->name('trainees');
    Route::get('/test', [TraineeController::class, 'test'])
    ->name('test');
    
    // Attendance 
     Route::inertia('attendance', 'attendance/attendance')->name('attendance');
     Route::inertia('create-attendance', 'attendance/create-attendance')->name('create-attendance');


     Route::inertia('scanner', 'scanner')->name('scanner');
});

require __DIR__ . '/settings.php';
