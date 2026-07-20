<?php

use Illuminate\Support\Facades\Route;

// Semua route non-/api diarahkan ke satu view yang me-load React.
// React Router (BrowserRouter) yang akan menangani routing di sisi client.
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');