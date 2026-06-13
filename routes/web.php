<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('user', 'users/user')->name('user');
    Route::inertia('create-user', 'users/create-user')->name('create-user');
    Route::inertia('trainees', 'trainees/trainees')->name('trainees');
    Route::inertia('create-trainee', 'trainees/create-trainee')->name('create-trainee');
});

require __DIR__.'/settings.php';
