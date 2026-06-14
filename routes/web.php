<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TraineeController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('user', 'users/user')->name('user');
    Route::inertia('create-user', 'users/create-user')->name('create-user');
    Route::inertia('create-trainee', 'trainees/create-trainee')->name('create-trainee');
    Route::post('/trainees', [TraineeController::class, 'store'])
        ->name('trainees.store');
    Route::get('/trainees', [TraineeController::class, 'index'])
        ->name('trainees');
    Route::get('/trainees/{trainee}/edit', [TraineeController::class, 'edit'])
        ->name('trainees-edit');
    Route::put('/trainees/{trainee}/update', [TraineeController::class, 'update'])
        ->name('trainees-update');
    Route::delete('/trainees/{trainee}/delete', [TraineeController::class, 'destroy'])
        ->name('trainees.destroy');
    Route::post('/import-trainees', [TraineeController::class, 'storeCSV']);
});

require __DIR__ . '/settings.php';
