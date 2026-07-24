import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { PageHeader, Card, Button, Input } from '../../components/ui';
import { useToast } from '../../context/ToastContext';

export default function Booking() {
    const [kendaraanList, setKendaraanList] = useState([]);
    const [tarifList, setTarifList] = useState([]);
    const [areaList, setAreaList] = useState([]);

    const [tambahKendaraan, setTambahKendaraan] = useState(false);
    const [formKendaraan, setFormKendaraan] = useState({ plat_nomor: '', jenis_kendaraan: '', warna: '' });
    const [savingKendaraan, setSavingKendaraan] = useState(false);

    const [form, setForm] = useState({
        id_kendaraan: '',
        id_area: '',
        id_tarif: '',
        tanggal_rencana: '',
        jam_rencana_masuk: '',
        jam_rencana_keluar: '',
        catatan: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [kodeSukses, setKodeSukses] = useState(null);
    const { showSuccess, showError } = useToast();

    async function loadSemua() {
        try {
            const [kendaraan, tarif, area] = await Promise.all([
                api.get('/kendaraan-saya'),
                api.get('/tarif'),
                api.get('/area-parkir'),
            ]);
            setKendaraanList(kendaraan.data);
            setTarifList(tarif.data);
            setAreaList(area.data);
        } catch (err) {
            showError('Gagal memuat data. Coba muat ulang halaman.');
        }
    }

    useEffect(() => {
        loadSemua();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function handleTambahKendaraan(e) {
        e.preventDefault();
        setSavingKendaraan(true);
        try {
            const res = await api.post('/kendaraan-saya', formKendaraan);
            showSuccess('Kendaraan berhasil ditambahkan');
            setKendaraanList((prev) => [res.data.data, ...prev]);
            setForm((f) => ({ ...f, id_kendaraan: res.data.data.id_kendaraan }));
            setFormKendaraan({ plat_nomor: '', jenis_kendaraan: '', warna: '' });
            setTambahKendaraan(false);
        } catch (err) {
            showError(err.response?.data?.message || 'Gagal menambahkan kendaraan.');
        } finally {
            setSavingKendaraan(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        setKodeSukses(null);
        try {
            const res = await api.post('/booking', form);
            setKodeSukses(res.data.data.kode_booking);
            showSuccess('Booking berhasil dibuat! Tunjukkan kode booking ke petugas saat tiba.');
            setForm({
                id_kendaraan: '',
                id_area: '',
                id_tarif: '',
                tanggal_rencana: '',
                jam_rencana_masuk: '',
                jam_rencana_keluar: '',
                catatan: '',
            });
        } catch (err) {
            showError(err.response?.data?.message || 'Gagal membuat booking.');
        } finally {
            setSubmitting(false);
        }
    }

    const today = new Date().toISOString().slice(0, 10);

    return (
        <div>
            <PageHeader
                eyebrow="BOOKING ONLINE"
                title="Booking Parkir"
                description="Pesan slot parkir sebelum tiba di pelabuhan. Kendaraan yang dipilih tetap perlu dicek petugas saat datang."
            />

            {kodeSukses && (
                <Card className="p-5 mb-6 border-[#F4B400]/40">
                    <p className="text-xs font-mono text-[#8B94A3] mb-1">KODE BOOKING ANDA</p>
                    <p className="font-display text-3xl text-[#F4B400] tracking-widest">{kodeSukses}</p>
                    <p className="text-sm text-[#8B94A3] mt-2">
                        Simpan kode ini. Tunjukkan ke petugas saat tiba di area parkir, setelah booking dikonfirmasi.
                    </p>
                </Card>
            )}

            <div className="max-w-xl space-y-6">
                <Card className="p-5">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="font-display text-base text-[#EDEFF2]">Kendaraan</h2>
                        <button
                            type="button"
                            onClick={() => setTambahKendaraan((v) => !v)}
                            className="text-xs font-mono text-[#F4B400] hover:underline"
                        >
                            {tambahKendaraan ? 'Batal' : '+ Tambah Kendaraan'}
                        </button>
                    </div>

                    {tambahKendaraan && (
                        <form onSubmit={handleTambahKendaraan} className="space-y-2 mb-4 border border-white/10 rounded-md p-3">
                            <Input
                                placeholder="Plat nomor, mis. AD 1234 XY"
                                className="font-mono uppercase"
                                value={formKendaraan.plat_nomor}
                                onChange={(e) => setFormKendaraan({ ...formKendaraan, plat_nomor: e.target.value })}
                                required
                            />
                            <Input
                                placeholder="Jenis kendaraan, mis. Mobil / Motor / Truk"
                                value={formKendaraan.jenis_kendaraan}
                                onChange={(e) => setFormKendaraan({ ...formKendaraan, jenis_kendaraan: e.target.value })}
                                required
                            />
                            <Input
                                placeholder="Warna (opsional)"
                                value={formKendaraan.warna}
                                onChange={(e) => setFormKendaraan({ ...formKendaraan, warna: e.target.value })}
                            />
                            <Button type="submit" disabled={savingKendaraan}>
                                {savingKendaraan ? 'Menyimpan...' : 'Simpan Kendaraan'}
                            </Button>
                        </form>
                    )}

                    {kendaraanList.length === 0 && !tambahKendaraan && (
                        <p className="text-sm text-[#8B94A3]">
                            Belum ada kendaraan terdaftar. Klik "+ Tambah Kendaraan" dulu.
                        </p>
                    )}

                    <div className="space-y-1">
                        {kendaraanList.map((k) => (
                            <button
                                key={k.id_kendaraan}
                                type="button"
                                onClick={() => setForm({ ...form, id_kendaraan: k.id_kendaraan })}
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
                </Card>

                <Card className="p-5">
                    <h2 className="font-display text-base text-[#EDEFF2] mb-3">Rencana Parkir</h2>
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

                        <div>
                            <label className="block text-xs font-mono text-[#8B94A3] mb-1.5">TANGGAL RENCANA</label>
                            <Input
                                type="date"
                                min={today}
                                value={form.tanggal_rencana}
                                onChange={(e) => setForm({ ...form, tanggal_rencana: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-mono text-[#8B94A3] mb-1.5">JAM MASUK</label>
                                <Input
                                    type="time"
                                    value={form.jam_rencana_masuk}
                                    onChange={(e) => setForm({ ...form, jam_rencana_masuk: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-[#8B94A3] mb-1.5">JAM KELUAR (OPSIONAL)</label>
                                <Input
                                    type="time"
                                    value={form.jam_rencana_keluar}
                                    onChange={(e) => setForm({ ...form, jam_rencana_keluar: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-mono text-[#8B94A3] mb-1.5">CATATAN (OPSIONAL)</label>
                            <Input
                                value={form.catatan}
                                onChange={(e) => setForm({ ...form, catatan: e.target.value })}
                                placeholder="mis. Bawa barang besar"
                            />
                        </div>

                        {!form.id_kendaraan && (
                            <p className="text-xs text-[#8B94A3]">Pilih kendaraan terlebih dahulu di atas.</p>
                        )}

                        <Button type="submit" disabled={!form.id_kendaraan || submitting}>
                            {submitting ? 'Memproses...' : 'Buat Booking'}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
}
