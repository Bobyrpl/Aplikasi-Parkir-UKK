<?php

namespace App\Console\Commands;

use App\Models\Booking;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class ExpireBookings extends Command
{
    /**
     * Booking (menunggu / dikonfirmasi) yang jam rencana masuknya sudah
     * lewat lebih dari batas toleransi ini otomatis ditandai "kadaluarsa".
     */
    private const TOLERANSI_MENIT = 60;

    protected $signature = 'booking:expire';

    protected $description = 'Tandai booking parkir yang sudah lewat waktu tanpa kedatangan sebagai kadaluarsa';

    public function handle(): int
    {
        $batas = Carbon::now()->subMinutes(self::TOLERANSI_MENIT);

        $booking = Booking::whereIn('status', ['menunggu', 'dikonfirmasi'])
            ->get()
            ->filter(function (Booking $b) use ($batas) {
                $waktuRencana = Carbon::parse($b->tanggal_rencana->format('Y-m-d') . ' ' . $b->jam_rencana_masuk);
                return $waktuRencana->lt($batas);
            });

        foreach ($booking as $b) {
            $b->update(['status' => 'kadaluarsa']);
        }

        $this->info("Booking ditandai kadaluarsa: {$booking->count()}");

        return self::SUCCESS;
    }
}
