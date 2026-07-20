<?php

namespace App\Http\Controllers;

use App\Models\AreaParkir;
use App\Models\LogAktivitas;
use App\Models\Tarif;
use App\Models\Transaksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TransaksiController extends Controller
{
    // GET /api/transaksi
    // Daftar transaksi (petugas), pakai limit/pagination biar tetap cepat
    public function index(Request $request)
    {
        $transaksi = Transaksi::with(['kendaraan:id_kendaraan,plat_nomor,jenis_kendaraan', 'area:id_area,nama_area'])
            ->orderBy('id_parkir', 'desc')
            ->paginate(10);

        return response()->json($transaksi);
    }

    // POST /api/transaksi/masuk
    // Catat kendaraan masuk parkir
    public function kendaraanMasuk(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_kendaraan' => 'required|exists:tb_kendaraan,id_kendaraan',
            'id_tarif'     => 'required|exists:tb_tarif,id_tarif',
            'id_area'      => 'required|exists:tb_area_parkir,id_area',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $area = AreaParkir::find($request->id_area);

        if ($area->isPenuh()) {
            return response()->json(['message' => 'Area parkir sudah penuh'], 422);
        }

        $transaksi = Transaksi::create([
            'id_kendaraan' => $request->id_kendaraan,
            'waktu_masuk'  => now(),
            'id_tarif'     => $request->id_tarif,
            'durasi_jam'   => 0,
            'biaya_total'  => 0,
            'status'       => 'masuk',
            'id_user'      => $request->user()->id_user,
            'id_area'      => $request->id_area,
        ]);

        // Update slot terisi di area parkir
        $area->increment('terisi');

        LogAktivitas::catat($request->user()->id_user, 'Mencatat kendaraan masuk parkir (id_parkir: ' . $transaksi->id_parkir . ')');

        return response()->json([
            'message' => 'Kendaraan berhasil dicatat masuk',
            'data'    => $transaksi,
        ], 201);
    }

    // POST /api/transaksi/{id}/keluar
    // Proses kendaraan keluar, hitung durasi & biaya otomatis
    public function kendaraanKeluar(Request $request, $id)
    {
        $transaksi = Transaksi::with('tarif')->find($id);

        if (! $transaksi) {
            return response()->json(['message' => 'Transaksi tidak ditemukan'], 404);
        }

        if ($transaksi->status === 'keluar') {
            return response()->json(['message' => 'Transaksi ini sudah selesai (kendaraan sudah keluar)'], 422);
        }

        $transaksi->waktu_keluar = now();
        $transaksi->hitungBiayaKeluar(); // helper di model Transaksi
        $transaksi->save();

        // Kurangi slot terisi di area parkir
        $area = AreaParkir::find($transaksi->id_area);
        if ($area && $area->terisi > 0) {
            $area->decrement('terisi');
        }

        LogAktivitas::catat($request->user()->id_user, 'Mencatat kendaraan keluar parkir (id_parkir: ' . $transaksi->id_parkir . ')');

        return response()->json([
            'message' => 'Kendaraan berhasil dicatat keluar',
            'data'    => $transaksi,
        ]);
    }

    // GET /api/transaksi/{id}/struk
    // Data untuk cetak struk parkir
    public function cetakStruk($id)
    {
        $transaksi = Transaksi::with(['kendaraan', 'tarif', 'area', 'user:id_user,nama_lengkap'])->find($id);

        if (! $transaksi) {
            return response()->json(['message' => 'Transaksi tidak ditemukan'], 404);
        }

        return response()->json([
            'no_struk'       => 'STR-' . str_pad($transaksi->id_parkir, 6, '0', STR_PAD_LEFT),
            'plat_nomor'     => $transaksi->kendaraan->plat_nomor,
            'jenis_kendaraan' => $transaksi->kendaraan->jenis_kendaraan,
            'area'           => $transaksi->area->nama_area,
            'waktu_masuk'    => $transaksi->waktu_masuk,
            'waktu_keluar'   => $transaksi->waktu_keluar,
            'durasi_jam'     => $transaksi->durasi_jam,
            'tarif_per_jam'  => $transaksi->tarif->tarif_per_jam,
            'biaya_total'    => $transaksi->biaya_total,
            'petugas'        => $transaksi->user->nama_lengkap,
        ]);
    }

    // GET /api/rekap-transaksi?dari=2026-07-01&sampai=2026-07-20
    // Khusus owner - rekap transaksi sesuai rentang waktu yang diminta
    public function rekap(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'dari'   => 'required|date',
            'sampai' => 'required|date|after_or_equal:dari',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $transaksi = Transaksi::with(['kendaraan:id_kendaraan,plat_nomor,jenis_kendaraan', 'area:id_area,nama_area'])
            ->whereBetween('waktu_masuk', [$request->dari . ' 00:00:00', $request->sampai . ' 23:59:59'])
            ->where('status', 'keluar')
            ->orderBy('waktu_masuk')
            ->get();

        $totalPendapatan = $transaksi->sum('biaya_total');
        $totalTransaksi  = $transaksi->count();

        return response()->json([
            'periode'          => $request->dari . ' s/d ' . $request->sampai,
            'total_transaksi'  => $totalTransaksi,
            'total_pendapatan' => $totalPendapatan,
            'data'             => $transaksi,
        ]);
    }

    // GET /api/transaksi/rekap-harian
    // Rekap transaksi & pendapatan harian untuk 7 hari terakhir (dipakai grafik dashboard)
    public function rekapHarian()
    {
        $mulai = now()->subDays(6)->startOfDay();

        $rekap = Transaksi::where('status', 'keluar')
            ->where('waktu_keluar', '>=', $mulai)
            ->selectRaw('DATE(waktu_keluar) as tanggal, COUNT(*) as jumlah_transaksi, SUM(biaya_total) as pendapatan')
            ->groupBy('tanggal')
            ->orderBy('tanggal')
            ->get();

        // Pastikan semua 7 hari muncul walau tidak ada transaksi (biar grafik tidak bolong)
        $hasil = collect(range(0, 6))->map(function ($i) use ($rekap, $mulai) {
            $tanggal = $mulai->copy()->addDays($i)->format('Y-m-d');
            $data = $rekap->firstWhere('tanggal', $tanggal);

            return [
                'tanggal' => $tanggal,
                'jumlah_transaksi' => $data->jumlah_transaksi ?? 0,
                'pendapatan' => (int) ($data->pendapatan ?? 0),
            ];
        });

        return response()->json($hasil);
    }
}