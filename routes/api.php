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
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/login-passkey', [AuthController::class, 'loginWithPasskey']);

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
    //  {#9a0,7}
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('users', UserController::class);
        Route::apiResource('tarif', TarifController::class)->except(['index', 'show']);
        Route::apiResource('area-parkir', AreaParkirController::class)->except(['index', 'show']);
        Route::apiResource('kendaraan', KendaraanController::class);
        Route::get('/log-aktivitas', [LogAktivitasController::class, 'index']);
    });

    /*
    |----------------------------------------------------------------
    | DATA REFERENSI (tarif & area parkir) - boleh dibaca admin & petugas
    | Petugas butuh ini untuk mengisi dropdown saat mencatat transaksi.
    | Create/update/delete tetap khusus admin (lihat grup di atas).
    |----------------------------------------------------------------
    */
    Route::middleware('role:admin,petugas')->group(function () {
        Route::get('/tarif', [TarifController::class, 'index']);
        Route::get('/tarif/{tarif}', [TarifController::class, 'show']);
        Route::get('/area-parkir', [AreaParkirController::class, 'index']);
        Route::get('/area-parkir/{area_parkir}', [AreaParkirController::class, 'show']);
    });

    /*
    |----------------------------------------------------------------
    | KHUSUS PETUGAS
    | Transaksi & Cetak Struk Parkir
    |----------------------------------------------------------------
    */
    //  {#af1,7}
    Route::middleware('role:petugas')->group(function () {
        Route::post('/transaksi/masuk', [TransaksiController::class, 'kendaraanMasuk']);
        Route::post('/transaksi/{id}/keluar', [TransaksiController::class, 'kendaraanKeluar']);
        Route::get('/transaksi/{id}/struk', [TransaksiController::class, 'cetakStruk']);
        Route::get('/transaksi', [TransaksiController::class, 'index']);
        Route::get('/transaksi/kendaraan-didalam', [TransaksiController::class, 'kendaraanDidalam']);
    });

    /*
    |----------------------------------------------------------------
    | KHUSUS OWNER
    | Rekap transaksi sesuai rentang waktu yang diminta
    |----------------------------------------------------------------
    */
    //  {#fbe,3}
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