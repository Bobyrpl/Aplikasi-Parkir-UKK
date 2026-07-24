<?php

namespace App\Http\Controllers;

use App\Models\AreaParkir;
use App\Models\Booking;
use App\Models\LogAktivitas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BookingController extends Controller
{
    /**
     * GET /api/booking
     * Khusus admin/petugas - lihat semua booking masuk, bisa difilter status.
     */
    public function index(Request $request)
    {
        $query = Booking::with([
            'user:id_user,nama_lengkap,no_telp',
            'kendaraan:id_kendaraan,plat_nomor,jenis_kendaraan',
            'area:id_area,nama_area',
            'tarif:id_tarif,jenis_kendaraan,tarif_per_jam',
        ])->orderBy('tanggal_rencana')->orderBy('jam_rencana_masuk');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->paginate(10)->withQueryString());
    }

    /**
     * GET /api/booking/saya
     * Khusus pelanggan - lihat booking miliknya sendiri.
     */
    public function bookingSaya(Request $request)
    {
        $booking = Booking::with(['kendaraan:id_kendaraan,plat_nomor,jenis_kendaraan', 'area:id_area,nama_area', 'tarif'])
            ->where('id_user', $request->user()->id_user)
            ->orderBy('id_booking', 'desc')
            ->get();

        return response()->json($booking);
    }

    /**
     * POST /api/booking
     * Khusus pelanggan - buat booking baru.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_kendaraan'        => 'required|exists:tb_kendaraan,id_kendaraan',
            'id_area'             => 'required|exists:tb_area_parkir,id_area',
            'id_tarif'            => 'required|exists:tb_tarif,id_tarif',
            'tanggal_rencana'     => 'required|date|after_or_equal:today',
            'jam_rencana_masuk'   => 'required|date_format:H:i',
            'jam_rencana_keluar'  => 'nullable|date_format:H:i|after:jam_rencana_masuk',
            'catatan'             => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Kendaraan yang dipakai booking harus milik pelanggan yang login sendiri
        $kendaraan = \App\Models\Kendaraan::find($request->id_kendaraan);
        if (! $kendaraan || $kendaraan->id_user !== $request->user()->id_user) {
            return response()->json(['message' => 'Kendaraan tidak ditemukan di akun anda'], 403);
        }

        $area = AreaParkir::find($request->id_area);
        if ($area->isPenuh()) {
            return response()->json(['message' => 'Area parkir yang dipilih sedang penuh'], 422);
        }

        $booking = Booking::create([
            'id_user'             => $request->user()->id_user,
            'id_kendaraan'        => $request->id_kendaraan,
            'id_area'             => $request->id_area,
            'id_tarif'            => $request->id_tarif,
            'tanggal_rencana'     => $request->tanggal_rencana,
            'jam_rencana_masuk'   => $request->jam_rencana_masuk,
            'jam_rencana_keluar'  => $request->jam_rencana_keluar,
            'kode_booking'        => Booking::buatKodeBooking(),
            'status'              => 'menunggu',
            'catatan'             => $request->catatan,
        ]);

        LogAktivitas::catat(
            $request->user()->id_user,
            'Membuat booking parkir (kode: ' . $booking->kode_booking . ')'
        );

        return response()->json([
            'message' => 'Booking berhasil dibuat, menunggu konfirmasi petugas',
            'data'    => $booking,
        ], 201);
    }

    /**
     * DELETE /api/booking/{id}
     * Khusus pelanggan - batalkan booking miliknya sendiri.
     */
    public function batalkan(Request $request, $id)
    {
        $booking = Booking::find($id);

        if (! $booking || $booking->id_user !== $request->user()->id_user) {
            return response()->json(['message' => 'Booking tidak ditemukan'], 404);
        }

        if (! $booking->isBisaDibatalkan()) {
            return response()->json(['message' => 'Booking ini sudah tidak bisa dibatalkan'], 422);
        }

        $booking->update(['status' => 'dibatalkan']);

        LogAktivitas::catat(
            $request->user()->id_user,
            'Membatalkan booking parkir (kode: ' . $booking->kode_booking . ')'
        );

        return response()->json(['message' => 'Booking berhasil dibatalkan']);
    }

    /**
     * POST /api/booking/{id}/konfirmasi
     * Khusus admin/petugas - konfirmasi booking yang masih "menunggu".
     */
    public function konfirmasi(Request $request, $id)
    {
        $booking = Booking::find($id);

        if (! $booking) {
            return response()->json(['message' => 'Booking tidak ditemukan'], 404);
        }

        if ($booking->status !== 'menunggu') {
            return response()->json(['message' => 'Booking ini sudah diproses sebelumnya'], 422);
        }

        $booking->update(['status' => 'dikonfirmasi']);

        LogAktivitas::catat(
            $request->user()->id_user,
            'Mengonfirmasi booking parkir (kode: ' . $booking->kode_booking . ')'
        );

        return response()->json(['message' => 'Booking berhasil dikonfirmasi', 'data' => $booking]);
    }

    /**
     * POST /api/booking/{id}/tolak
     * Khusus admin/petugas - tolak booking yang masih "menunggu".
     */
    public function tolak(Request $request, $id)
    {
        $booking = Booking::find($id);

        if (! $booking) {
            return response()->json(['message' => 'Booking tidak ditemukan'], 404);
        }

        if ($booking->status !== 'menunggu') {
            return response()->json(['message' => 'Booking ini sudah diproses sebelumnya'], 422);
        }

        $booking->update(['status' => 'dibatalkan']);

        LogAktivitas::catat(
            $request->user()->id_user,
            'Menolak booking parkir (kode: ' . $booking->kode_booking . ')'
        );

        return response()->json(['message' => 'Booking berhasil ditolak']);
    }

    /**
     * GET /api/booking/cari/{kode_booking}
     * Khusus admin/petugas - cari booking terkonfirmasi lewat kode,
     * dipakai saat pelanggan datang & mau dicatat sebagai kendaraan masuk.
     */
    public function cariByKode($kode_booking)
    {
        $booking = Booking::with(['kendaraan', 'area', 'tarif'])
            ->where('kode_booking', $kode_booking)
            ->where('status', 'dikonfirmasi')
            ->first();

        if (! $booking) {
            return response()->json(['message' => 'Kode booking tidak ditemukan atau belum dikonfirmasi'], 404);
        }

        return response()->json($booking);
    }
}
