<?php
use App\Http\Controllers\AshorePassesController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\PersonnelController;
use App\Http\Controllers\ScanController;
use App\Http\Controllers\TraineeController;
use App\Http\Controllers\UserController;

Route::inertia('/', 'welcome')->name('home');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('create-trainee', 'trainees/create-trainee')->name('create-trainee');

    Route::get('/users', [UserController::class, 'index'])->name('users');
    Route::inertia('create-user', 'users/create-user')->name('create-user');
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/{id}/edit', [UserController::class, 'edit']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    // Route::resource('personnels', PersonnelController::class);
    Route::get('/personnels', [PersonnelController::class, 'index'])->name('personnel');


    Route::post('/trainees', [TraineeController::class, 'store'])
        ->name('trainees.store');
    Route::get('/trainees', [TraineeController::class, 'index'])->name('trainees');
    Route::get('/trainees/{trainee}/edit', [TraineeController::class, 'edit'])
        ->name('trainees-edit');
    Route::put('/trainees/{trainee}/update', [TraineeController::class, 'update'])
        ->name('trainees-update');
    Route::delete('/trainees/{trainee}/delete', [TraineeController::class, 'destroy'])
        ->name('trainees.destroy');
    Route::post('/import-trainees', [TraineeController::class, 'storeCSV']);

    Route::get('/attendance',[AttendanceController::class,'index'])->name('attendance');
    Route::inertia('create-attendance', 'attendance/create-attendance')->name('create-attendance');
    Route::get('/ashore-passes', [AshorePassesController::class, 'index'])->name('ashore.passes');
});

Route::middleware(['auth', 'verified', 'role:User'])->group(function () {
    Route::inertia('/scanner', 'scanner')->name('scanner');
    Route::get('/scan/{type}/{id}', [ScanController::class, 'qr_code'])
        ->name('scan.show');
    Route::post('/ashore-post/{trainee}', [AshorePassesController::class, 'store'])
        ->name('ashore.store');
            
});


require __DIR__ . '/settings.php';
