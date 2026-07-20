import { useState } from 'react';
import api from '../../api/axios';
import { PageHeader, Card, Table, Button, Input, StatCard } from '../../components/ui';

export default function Rekap() {
    const today = new Date().toISOString().slice(0, 10);
    const [dari, setDari] = useState(today);
    const [sampai, setSampai] = useState(today);
    const [hasil, setHasil] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await api.get('/rekap-transaksi', { params: { dari, sampai } });
            setHasil(res.data);
        } catch (err) {
            setError('Gagal mengambil rekap transaksi');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <PageHeader
                eyebrow="LAPORAN"
                title="Rekap Transaksi"
                description="Lihat total transaksi & pendapatan pada rentang waktu tertentu."
            />

            <Card className="p-5 mb-6 max-w-2xl">
                <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
                    <div>
                        <label className="block text-xs font-mono text-[#8B94A3] mb-1.5">DARI TANGGAL</label>
                        <Input type="date" value={dari} onChange={(e) => setDari(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-xs font-mono text-[#8B94A3] mb-1.5">SAMPAI TANGGAL</label>
                        <Input type="date" value={sampai} onChange={(e) => setSampai(e.target.value)} required />
                    </div>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Memuat...' : 'Tampilkan'}
                    </Button>
                </form>
                {error && <p className="text-sm text-[#E5484D] mt-3">{error}</p>}
            </Card>

            {hasil && (
                <>
                    <div className="grid grid-cols-2 gap-4 mb-6 max-w-md">
                        <StatCard label="TOTAL TRANSAKSI" value={hasil.total_transaksi} />
                        <StatCard
                            label="TOTAL PENDAPATAN"
                            value={`Rp ${Number(hasil.total_pendapatan).toLocaleString('id-ID')}`}
                            accent="#35C48D"
                        />
                    </div>

                    <Table columns={['Plat Nomor', 'Area', 'Masuk', 'Keluar', 'Durasi', 'Biaya']}>
                        {hasil.data.map((item) => (
                            <tr key={item.id_parkir}>
                                <td className="px-4 py-3 font-mono uppercase">{item.kendaraan?.plat_nomor}</td>
                                <td className="px-4 py-3">{item.area?.nama_area}</td>
                                <td className="px-4 py-3 font-mono text-xs">
                                    {new Date(item.waktu_masuk).toLocaleString('id-ID')}
                                </td>
                                <td className="px-4 py-3 font-mono text-xs">
                                    {new Date(item.waktu_keluar).toLocaleString('id-ID')}
                                </td>
                                <td className="px-4 py-3 font-mono">{item.durasi_jam} jam</td>
                                <td className="px-4 py-3 font-mono">
                                    Rp {Number(item.biaya_total).toLocaleString('id-ID')}
                                </td>
                            </tr>
                        ))}
                        {hasil.data.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-4 py-6 text-center text-[#8B94A3] text-sm">
                                    Tidak ada transaksi pada periode ini.
                                </td>
                            </tr>
                        )}
                    </Table>
                </>
            )}
        </div>
    );
}
