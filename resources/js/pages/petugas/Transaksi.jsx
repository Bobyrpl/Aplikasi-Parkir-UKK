import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { PageHeader, Table, Badge, Button } from '../../components/ui';
import StrukCard from '../../components/StrukCard';
import { useToast } from '../../context/ToastContext';

export default function Transaksi() {
    const [data, setData] = useState([]);
    const [struk, setStruk] = useState(null);
    const [loadingId, setLoadingId] = useState(null);
    const { showError } = useToast();

    useEffect(() => {
        async function load() {
            const res = await api.get('/transaksi');
            setData(res.data.data ?? res.data);
        }
        load();
    }, []);

    async function handleCetakUlang(id) {
        setLoadingId(id);
        try {
            const res = await api.get(`/transaksi/${id}/struk`);
            setStruk(res.data);
        } catch (err) {
            showError(err.response?.data?.message || 'Gagal memuat struk transaksi ini.');
        } finally {
            setLoadingId(null);
        }
    }

    return (
        <div>
            <PageHeader
                eyebrow="RIWAYAT"
                title="Semua Transaksi"
                description="Daftar seluruh transaksi parkir yang tercatat."
            />

            <Table columns={['Plat Nomor', 'Area', 'Masuk', 'Keluar', 'Biaya', 'Status', 'Aksi']}>
                {data.map((item) => (
                    <tr key={item.id_parkir}>
                        <td className="px-4 py-3 font-mono uppercase">{item.kendaraan?.plat_nomor}</td>
                        <td className="px-4 py-3">{item.area?.nama_area}</td>
                        <td className="px-4 py-3 font-mono text-xs">
                            {new Date(item.waktu_masuk).toLocaleString('id-ID')}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs">
                            {item.waktu_keluar ? new Date(item.waktu_keluar).toLocaleString('id-ID') : '-'}
                        </td>
                        <td className="px-4 py-3 font-mono">
                            {item.biaya_total ? `Rp ${Number(item.biaya_total).toLocaleString('id-ID')}` : '-'}
                        </td>
                        <td className="px-4 py-3">
                            {item.status === 'masuk' ? (
                                <Badge tone="warning">Di dalam</Badge>
                            ) : (
                                <Badge tone="success">Selesai</Badge>
                            )}
                        </td>
                        <td className="px-4 py-3">
                            {item.status === 'keluar' && (
                                <Button
                                    variant="ghost"
                                    onClick={() => handleCetakUlang(item.id_parkir)}
                                    disabled={loadingId === item.id_parkir}
                                >
                                    {loadingId === item.id_parkir ? 'Memuat...' : 'Cetak Ulang'}
                                </Button>
                            )}
                        </td>
                    </tr>
                ))}
                {data.length === 0 && (
                    <tr>
                        <td colSpan={7} className="px-4 py-6 text-center text-[#8B94A3] text-sm">
                            Belum ada transaksi.
                        </td>
                    </tr>
                )}
            </Table>

            <StrukCard struk={struk} onClose={() => setStruk(null)} />
        </div>
    );
}