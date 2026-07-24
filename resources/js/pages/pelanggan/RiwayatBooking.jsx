import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { PageHeader, Table, Badge, Button } from '../../components/ui';
import { useToast } from '../../context/ToastContext';

const STATUS_TONE = {
    menunggu: 'warning',
    dikonfirmasi: 'success',
    selesai: 'neutral',
    dibatalkan: 'danger',
    kadaluarsa: 'danger',
};

const STATUS_LABEL = {
    menunggu: 'Menunggu Konfirmasi',
    dikonfirmasi: 'Dikonfirmasi',
    selesai: 'Selesai',
    dibatalkan: 'Dibatalkan',
    kadaluarsa: 'Kadaluarsa',
};

export default function RiwayatBooking() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);
    const { showSuccess, showError } = useToast();

    async function load() {
        setLoading(true);
        try {
            const res = await api.get('/booking/saya');
            setData(res.data);
        } catch (err) {
            showError('Gagal memuat riwayat booking.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function handleBatalkan(id) {
        if (!confirm('Yakin ingin membatalkan booking ini?')) return;
        setCancellingId(id);
        try {
            await api.delete(`/booking/${id}`);
            showSuccess('Booking berhasil dibatalkan');
            load();
        } catch (err) {
            showError(err.response?.data?.message || 'Gagal membatalkan booking.');
        } finally {
            setCancellingId(null);
        }
    }

    return (
        <div>
            <PageHeader
                eyebrow="RIWAYAT"
                title="Booking Saya"
                description="Daftar seluruh booking parkir yang pernah anda buat."
            />

            <Table columns={['Kode', 'Kendaraan', 'Area', 'Tanggal & Jam', 'Status', 'Aksi']}>
                {data.map((b) => (
                    <tr key={b.id_booking}>
                        <td className="px-4 py-3 font-mono text-[#F4B400]">{b.kode_booking}</td>
                        <td className="px-4 py-3 font-mono uppercase">{b.kendaraan?.plat_nomor}</td>
                        <td className="px-4 py-3">{b.area?.nama_area}</td>
                        <td className="px-4 py-3 font-mono text-xs">
                            {new Date(b.tanggal_rencana).toLocaleDateString('id-ID')} · {b.jam_rencana_masuk?.slice(0, 5)}
                        </td>
                        <td className="px-4 py-3">
                            <Badge tone={STATUS_TONE[b.status] || 'neutral'}>{STATUS_LABEL[b.status] || b.status}</Badge>
                        </td>
                        <td className="px-4 py-3">
                            {['menunggu', 'dikonfirmasi'].includes(b.status) && (
                                <Button
                                    variant="danger"
                                    onClick={() => handleBatalkan(b.id_booking)}
                                    disabled={cancellingId === b.id_booking}
                                >
                                    {cancellingId === b.id_booking ? 'Memproses...' : 'Batalkan'}
                                </Button>
                            )}
                        </td>
                    </tr>
                ))}
                {!loading && data.length === 0 && (
                    <tr>
                        <td colSpan={6} className="px-4 py-6 text-center text-[#8B94A3] text-sm">
                            Belum ada booking. Buat booking baru lewat menu "Booking Parkir".
                        </td>
                    </tr>
                )}
                {loading && (
                    <tr>
                        <td colSpan={6} className="px-4 py-6 text-center text-[#8B94A3] text-sm">
                            Memuat data...
                        </td>
                    </tr>
                )}
            </Table>
        </div>
    );
}
