<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaksi extends Model
{
    use HasFactory;

    protected $table = 'tb_transaksi';
    protected $primaryKey = 'id_parkir';

    public $timestamps = false;

    protected $fillable = [
        'id_kendaraan',
        'waktu_masuk',
        'waktu_keluar',
        'id_tarif',
        'durasi_jam',
        'biaya_total',
        'status',
        'id_user',
        'id_area',
    ];

    protected $casts = [
        'waktu_masuk'  => 'datetime',
        'waktu_keluar' => 'datetime',
        'biaya_total'  => 'decimal:0',
    ];

    /* ==========================================================
     * RELASI
     * ========================================================== */

    public function kendaraan()
    {
        return $this->belongsTo(Kendaraan::class, 'id_kendaraan', 'id_kendaraan');
    }

    public function tarif()
    {
        return $this->belongsTo(Tarif::class, 'id_tarif', 'id_tarif');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    public function area()
    {
        return $this->belongsTo(AreaParkir::class, 'id_area', 'id_area');
    }

    /* ==========================================================
     * HELPER PROSES TRANSAKSI
     * ========================================================== */

    // Hitung durasi (jam, dibulatkan ke atas) & biaya saat kendaraan keluar
    public function hitungBiayaKeluar(): void
    {
        $masuk  = $this->waktu_masuk;
        $keluar = $this->waktu_keluar ?? now();

        $jam = (int) ceil($masuk->diffInMinutes($keluar) / 60);
        $jam = max(1, $jam); // minimal dihitung 1 jam

        $this->durasi_jam  = $jam;
        $this->biaya_total = $jam * $this->tarif->tarif_per_jam;
        $this->status      = 'keluar';
    }
}
