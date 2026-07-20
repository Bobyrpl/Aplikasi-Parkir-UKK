import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { PageHeader, Table, Badge } from '../../components/ui';

export default function Transaksi() {
    const [data, setData] = useState([]);

    useEffect(() => {
        async function load() {
            const res = await api.get('/transaksi');
            setData(res.data.data ?? res.data);
        }
        load();
    }, []);

    return (
        <div>
            <PageHeader
                eyebrow="RIWAYAT"
                title="Semua Transaksi"
                description="Daftar seluruh transaksi parkir yang tercatat."
            />

            <Table columns={['Plat Nomor', 'Area', 'Masuk', 'Keluar', 'Biaya', 'Status']}>
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
                    </tr>
                ))}
                {data.length === 0 && (
                    <tr>
                        <td colSpan={6} className="px-4 py-6 text-center text-[#8B94A3] text-sm">
                            Belum ada transaksi.
                        </td>
                    </tr>
                )}
            </Table>
        </div>
    );
}
