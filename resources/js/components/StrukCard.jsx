export default function StrukCard({ struk, onClose }) {
    if (!struk) return null;

    const formatRupiah = (n) => 'Rp ' + Number(n).toLocaleString('id-ID');
    const formatWaktu = (t) => (t ? new Date(t).toLocaleString('id-ID') : '-');

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50">
            <div className="relative w-full max-w-sm">
                {/* notch kiri-kanan meniru sobekan tiket */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-[#14181F]" />
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-[#14181F]" />

                <div className="bg-[#F7F7F5] text-[#14181F] rounded-lg overflow-hidden">
                    <div
                        className="h-2 w-full"
                        style={{
                            backgroundImage:
                                'repeating-linear-gradient(45deg, #F4B400 0 10px, #14181F 10px 20px)',
                        }}
                    />
                    <div className="p-6 font-mono text-sm">
                        <p className="text-center font-display text-lg tracking-tight mb-1">
                            ParkirKu
                        </p>
                        <p className="text-center text-xs text-[#6B7280] mb-4">
                            STRUK PARKIR — {struk.no_struk}
                        </p>

                        <div className="border-t border-dashed border-[#C3C9D3] my-3" />

                        <Row label="Plat Nomor" value={struk.plat_nomor} strong />
                        <Row label="Jenis" value={struk.jenis_kendaraan} />
                        <Row label="Area" value={struk.area} />
                        <Row label="Masuk" value={formatWaktu(struk.waktu_masuk)} />
                        <Row label="Keluar" value={formatWaktu(struk.waktu_keluar)} />
                        <Row label="Durasi" value={`${struk.durasi_jam} jam`} />
                        <Row label="Tarif/Jam" value={formatRupiah(struk.tarif_per_jam)} />

                        <div className="border-t border-dashed border-[#C3C9D3] my-3" />

                        <div className="flex justify-between items-baseline">
                            <span className="text-xs text-[#6B7280]">TOTAL BAYAR</span>
                            <span className="font-display text-2xl">{formatRupiah(struk.biaya_total)}</span>
                        </div>

                        <p className="text-center text-[10px] text-[#9AA1AC] mt-4">
                            Dilayani oleh {struk.petugas} · Terima kasih
                        </p>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="mt-4 w-full rounded-md bg-[#1B212B] text-[#EDEFF2] py-2.5 text-sm hover:bg-[#262E3A] transition-colors"
                >
                    Tutup
                </button>
            </div>
        </div>
    );
}

function Row({ label, value, strong }) {
    return (
        <div className="flex justify-between py-0.5">
            <span className="text-[#6B7280]">{label}</span>
            <span className={strong ? 'font-semibold' : ''}>{value}</span>
        </div>
    );
}
