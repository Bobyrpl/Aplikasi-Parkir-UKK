import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { PageHeader, Table, Button, Badge } from '../../components/ui';
import StrukCard from '../../components/StrukCard';

export default function KendaraanKeluar() {
    const [data, setData] = useState([]);
    const [struk, setStruk] = useState(null);
    const [loadingId, setLoadingId] = useState(null);

    async function load() {
        const res = await api.get('/transaksi');
        const list = res.data.data ?? res.data;
        setData(list.filter((t) => t.status === 'masuk'));
    }

    useEffect(() => {
        load();
    }, []);

    async function handleKeluar(id) {
        setLoadingId(id);
        try {
            await api.post(`/transaksi/${id}/keluar`);
            const res = await api.get(`/transaksi/${id}/struk`);
            setStruk(res.data);
            load();
        } catch (err) {
            alert('Gagal memproses kendaraan keluar');
        } finally {
            setLoadingId(null);
        }
    }

    return (
        <div>
            <PageHeader
                eyebrow="TRANSAKSI"
                title="Kendaraan Keluar"
                description="Daftar kendaraan yang masih berada di area parkir."
            />

            <Table columns={['Plat Nomor', 'Jenis', 'Area', 'Waktu Masuk', 'Aksi']}>
                {data.map((item) => (
                    <tr key={item.id_parkir}>
                        <td className="px-4 py-3 font-mono uppercase">{item.kendaraan?.plat_nomor}</td>
                        <td className="px-4 py-3 capitalize">{item.kendaraan?.jenis_kendaraan}</td>
                        <td className="px-4 py-3">{item.area?.nama_area}</td>
                        <td className="px-4 py-3 font-mono text-xs">
                            {new Date(item.waktu_masuk).toLocaleString('id-ID')}
                        </td>
                        <td className="px-4 py-3">
                            <Button
                                onClick={() => handleKeluar(item.id_parkir)}
                                disabled={loadingId === item.id_parkir}
                            >
                                {loadingId === item.id_parkir ? 'Memproses...' : 'Proses Keluar'}
                            </Button>
                        </td>
                    </tr>
                ))}
                {data.length === 0 && (
                    <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-[#8B94A3] text-sm">
                            Tidak ada kendaraan di dalam area parkir.
                        </td>
                    </tr>
                )}
            </Table>

            <StrukCard struk={struk} onClose={() => setStruk(null)} />
        </div>
    );
}
