<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AreaParkirController;
use App\Http\Controllers\KendaraanController;
use App\Http\Controllers\LogAktivitasController;
use App\Http\Controllers\TarifController;
use App\Http\Controllers\TransaksiController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| ROUTE PUBLIK (tidak perlu login)
|--------------------------------------------------------------------------
*/
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| ROUTE YANG WAJIB LOGIN (semua role: admin, petugas, owner)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    /*
    |----------------------------------------------------------------
    | KHUSUS ADMIN
    | CRUD User, Tarif, Area Parkir, Kendaraan, Akses Log Aktivitas
    |----------------------------------------------------------------
    */
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('users', UserController::class);
        Route::apiResource('tarif', TarifController::class);
        Route::apiResource('area-parkir', AreaParkirController::class);
        Route::apiResource('kendaraan', KendaraanController::class);
        Route::get('/log-aktivitas', [LogAktivitasController::class, 'index']);
    });

    /*
    |----------------------------------------------------------------
    | KHUSUS PETUGAS
    | Transaksi & Cetak Struk Parkir
    |----------------------------------------------------------------
    */
    Route::middleware('role:petugas')->group(function () {
        Route::post('/transaksi/masuk', [TransaksiController::class, 'kendaraanMasuk']);
        Route::post('/transaksi/{id}/keluar', [TransaksiController::class, 'kendaraanKeluar']);
        Route::get('/transaksi/{id}/struk', [TransaksiController::class, 'cetakStruk']);
        Route::get('/transaksi', [TransaksiController::class, 'index']);
    });

    /*
    |----------------------------------------------------------------
    | KHUSUS OWNER
    | Rekap transaksi sesuai rentang waktu yang diminta
    |----------------------------------------------------------------
    */
    Route::middleware('role:owner')->group(function () {
        Route::get('/rekap-transaksi', [TransaksiController::class, 'rekap']);
    });

    /*
    |----------------------------------------------------------------
    | BOLEH DIAKSES LEBIH DARI SATU ROLE (opsional, contoh)
    | Misal admin & petugas sama-sama boleh lihat data kendaraan
    |----------------------------------------------------------------
    */
    Route::middleware('role:admin,petugas')->group(function () {
        Route::get('/kendaraan/cari/{plat_nomor}', [KendaraanController::class, 'cariByPlat']);
    });

    Route::get('/transaksi/rekap-harian', [TransaksiController::class, 'rekapHarian']);
    
});
