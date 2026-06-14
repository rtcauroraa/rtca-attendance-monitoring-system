<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PersonnelController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('user', 'users/user')->name('user');
    Route::inertia('create-user', 'users/create-user')->name('create-user');
    Route::inertia('trainees', 'trainees/trainees')->name('trainees');
    Route::inertia('create-trainee', 'trainees/create-trainee')->name('create-trainee');

     // Personnel 
    Route::resource('personnels', PersonnelController::class);
});

require __DIR__.'/settings.php';
