import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { PageHeader, Card, Button, Input } from '../../components/ui';
import { useToast } from '../../context/ToastContext';

export default function KendaraanMasuk() {
    const [kendaraanList, setKendaraanList] = useState([]);
    const [tarifList, setTarifList] = useState([]);
    const [areaList, setAreaList] = useState([]);
    const [cari, setCari] = useState('');
    const [form, setForm] = useState({ id_kendaraan: '', id_tarif: '', id_area: '', id_booking: '' });
    const [submitting, setSubmitting] = useState(false);
    const [kodeBooking, setKodeBooking] = useState('');
    const [bookingInfo, setBookingInfo] = useState(null);
    const [cariBookingLoading, setCariBookingLoading] = useState(false);
    const { showSuccess, showError } = useToast();

    async function handleCariBooking(e) {
        e.preventDefault();
        if (!kodeBooking.trim()) return;
        setCariBookingLoading(true);
        try {
            const res = await api.get(`/booking/cari/${kodeBooking.trim()}`);
            const b = res.data;
            setBookingInfo(b);
            setForm({
                id_kendaraan: b.id_kendaraan,
                id_tarif: b.id_tarif,
                id_area: b.id_area,
                id_booking: b.id_booking,
            });
            showSuccess(`Booking ditemukan: ${b.kendaraan?.plat_nomor}`);
        } catch (err) {
            setBookingInfo(null);
            showError(err.response?.data?.message || 'Kode booking tidak ditemukan.');
        } finally {
            setCariBookingLoading(false);
        }
    }

    useEffect(() => {
        async function load() {
            try {
                const [tarif, area] = await Promise.all([
                    api.get('/tarif'),
                    api.get('/area-parkir'),
                ]);
                setTarifList(tarif.data);
                setAreaList(area.data);
            } catch (err) {
                showError('Gagal memuat data tarif/area parkir.');
            }
        }
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function handleCari(e) {
        e.preventDefault();
        if (!cari.trim()) return;
        try {
            const res = await api.get(`/kendaraan/cari/${cari}`);
            setKendaraanList(res.data);
            if (res.data.length === 0) {
                showError(`Tidak ada kendaraan dengan plat nomor "${cari}".`);
            }
        } catch (err) {
            showError(err.response?.data?.message || 'Gagal mencari kendaraan.');
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await api.post('/transaksi/masuk', form);
            showSuccess(`Kendaraan berhasil dicatat masuk. ID transaksi: ${res.data.data.id_parkir}`);
            setForm({ id_kendaraan: '', id_tarif: '', id_area: '', id_booking: '' });
            setKendaraanList([]);
            setCari('');
            setKodeBooking('');
            setBookingInfo(null);
        } catch (err) {
            showError(err.response?.data?.message || 'Gagal mencatat kendaraan masuk.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div>
            <PageHeader
                eyebrow="TRANSAKSI"
                title="Kendaraan Masuk"
                description="Cari kendaraan lalu catat waktu masuk & area parkirnya."
            />

            <div className="max-w-xl space-y-6">
                <Card className="p-5">
                    <h2 className="font-display text-base text-[#EDEFF2] mb-3">Punya Kode Booking?</h2>
                    <form onSubmit={handleCariBooking} className="flex gap-2">
                        <Input
                            className="font-mono uppercase"
                            value={kodeBooking}
                            onChange={(e) => setKodeBooking(e.target.value)}
                            placeholder="mis. BKG-7F3K9A"
                        />
                        <Button type="submit" disabled={cariBookingLoading}>
                            {cariBookingLoading ? 'Mencari...' : 'Cari'}
                        </Button>
                    </form>
                    {bookingInfo && (
                        <p className="mt-3 text-xs text-[#35C48D]">
                            Booking dipakai: {bookingInfo.kendaraan?.plat_nomor} — {bookingInfo.area?.nama_area}. Form di bawah otomatis terisi.
                        </p>
                    )}
                </Card>

                <Card className="p-5">
                    <h2 className="font-display text-base text-[#EDEFF2] mb-3">atau Cari Kendaraan (plat nomor)</h2>
                    <form onSubmit={handleCari} className="flex gap-2">
                        <Input
                            className="font-mono uppercase"
                            value={cari}
                            onChange={(e) => setCari(e.target.value)}
                            placeholder="mis. AD 1234"
                        />
                        <Button type="submit">Cari</Button>
                    </form>

                    {kendaraanList.length > 0 && (
                        <div className="mt-3 space-y-1">
                            {kendaraanList.map((k) => (
                                <button
                                    key={k.id_kendaraan}
                                    type="button"
                                    onClick={() => {
                                        setForm({ ...form, id_kendaraan: k.id_kendaraan, id_booking: '' });
                                        setBookingInfo(null);
                                    }}
                                    className={`w-full text-left rounded-md px-3 py-2 text-sm font-mono border ${
                                        form.id_kendaraan === k.id_kendaraan
                                            ? 'border-[#F4B400] bg-[#F4B400]/10 text-[#F4B400]'
                                            : 'border-white/10 text-[#C3C9D3] hover:bg-white/5'
                                    }`}
                                >
                                    {k.plat_nomor} — {k.jenis_kendaraan}
                                </button>
                            ))}
                        </div>
                    )}
                </Card>

                <Card className="p-5">
                    <h2 className="font-display text-base text-[#EDEFF2] mb-3">Detail Parkir</h2>
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div>
                            <label className="block text-xs font-mono text-[#8B94A3] mb-1.5">TARIF</label>
                            <select
                                value={form.id_tarif}
                                onChange={(e) => setForm({ ...form, id_tarif: e.target.value })}
                                required
                                className="w-full rounded-md bg-[#14181F] border border-white/10 px-3 py-2 text-sm text-[#EDEFF2] focus:outline-none focus:ring-2 focus:ring-[#F4B400]"
                            >
                                <option value="">Pilih tarif</option>
                                {tarifList.map((t) => (
                                    <option key={t.id_tarif} value={t.id_tarif}>
                                        {t.jenis_kendaraan} — Rp {Number(t.tarif_per_jam).toLocaleString('id-ID')}/jam
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-[#8B94A3] mb-1.5">AREA PARKIR</label>
                            <select
                                value={form.id_area}
                                onChange={(e) => setForm({ ...form, id_area: e.target.value })}
                                required
                                className="w-full rounded-md bg-[#14181F] border border-white/10 px-3 py-2 text-sm text-[#EDEFF2] focus:outline-none focus:ring-2 focus:ring-[#F4B400]"
                            >
                                <option value="">Pilih area</option>
                                {areaList.map((a) => (
                                    <option key={a.id_area} value={a.id_area} disabled={a.terisi >= a.kapasitas}>
                                        {a.nama_area} ({a.terisi}/{a.kapasitas}){a.terisi >= a.kapasitas ? ' - Penuh' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {!form.id_kendaraan && (
                            <p className="text-xs text-[#8B94A3]">
                                Cari &amp; pilih kendaraan terlebih dahulu di atas.
                            </p>
                        )}

                        <Button type="submit" disabled={!form.id_kendaraan || submitting}>
                            {submitting ? 'Memproses...' : 'Catat Kendaraan Masuk'}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
}