import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { PageHeader, Table, Badge } from '../../components/ui';

export default function LogAktivitas() {
    const [data, setData] = useState([]);

    useEffect(() => {
        async function load() {
            const res = await api.get('/log-aktivitas');
            setData(res.data.data ?? res.data);
        }
        load();
    }, []);

    return (
        <div>
            <PageHeader
                eyebrow="AUDIT"
                title="Log Aktivitas"
                description="Riwayat aktivitas seluruh pengguna sistem."
            />

            <Table columns={['Waktu', 'Pengguna', 'Role', 'Aktivitas']}>
                {data.map((item) => (
                    <tr key={item.id_log}>
                        <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">
                            {new Date(item.waktu_aktivitas).toLocaleString('id-ID')}
                        </td>
                        <td className="px-4 py-3">{item.user?.nama_lengkap ?? '-'}</td>
                        <td className="px-4 py-3">
                            <Badge tone="neutral">{item.user?.role ?? '-'}</Badge>
                        </td>
                        <td className="px-4 py-3 text-[#C3C9D3]">{item.aktivitas}</td>
                    </tr>
                ))}
                {data.length === 0 && (
                    <tr>
                        <td colSpan={4} className="px-4 py-6 text-center text-[#8B94A3] text-sm">
                            Belum ada aktivitas tercatat.
                        </td>
                    </tr>
                )}
            </Table>
        </div>
    );
}
