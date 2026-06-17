<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\PersonnelController;
use App\Http\Controllers\TraineeController;
use App\Http\Controllers\UserController;

Route::inertia('/', 'welcome')->name('home');
Route::inertia('scanner', 'scanner')->name('scanner');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('create-user', 'users/create-user')->name('create-user');
    Route::inertia('create-trainee', 'trainees/create-trainee')->name('create-trainee');
    
    Route::get('/users', [UserController::class, 'index'])->name('users');
 
    // Route::resource('personnels', PersonnelController::class);
    Route::get('/personnels', [PersonnelController::class, 'index'])->name('personnel');


    Route::post('/trainees', [TraineeController::class, 'store'])
        ->name('trainees.store');
    Route::get('/trainees', [TraineeController::class, 'index'])
    ->name('trainees');
    
    // Attendance 
     Route::inertia('attendance', 'attendance/attendance')->name('attendance');
     Route::inertia('create-attendance', 'attendance/create-attendance')->name('create-attendance');


 
});

require __DIR__ . '/settings.php';
