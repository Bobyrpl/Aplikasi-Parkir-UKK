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
    menunggu: 'Menunggu',
    dikonfirmasi: 'Dikonfirmasi',
    selesai: 'Selesai',
    dibatalkan: 'Dibatalkan',
    kadaluarsa: 'Kadaluarsa',
};

export default function Booking() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('menunggu');
    const [processingId, setProcessingId] = useState(null);
    const { showSuccess, showError } = useToast();

    async function load(status = filter) {
        setLoading(true);
        try {
            const res = await api.get('/booking', { params: status ? { status } : {} });
            setData(res.data.data ?? res.data);
        } catch (err) {
            showError('Gagal memuat data booking.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load(filter);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    async function handleKonfirmasi(id) {
        setProcessingId(id);
        try {
            await api.post(`/booking/${id}/konfirmasi`);
            showSuccess('Booking dikonfirmasi');
            load();
        } catch (err) {
            showError(err.response?.data?.message || 'Gagal mengonfirmasi booking.');
        } finally {
            setProcessingId(null);
        }
    }

    async function handleTolak(id) {
        if (!confirm('Yakin ingin menolak booking ini?')) return;
        setProcessingId(id);
        try {
            await api.post(`/booking/${id}/tolak`);
            showSuccess('Booking ditolak');
            load();
        } catch (err) {
            showError(err.response?.data?.message || 'Gagal menolak booking.');
        } finally {
            setProcessingId(null);
        }
    }

    return (
        <div>
            <PageHeader
                eyebrow="BOOKING ONLINE"
                title="Booking Masuk"
                description="Kelola booking parkir yang dibuat pelanggan lewat aplikasi."
            />

            <div className="flex gap-2 mb-4">
                {[
                    ['menunggu', 'Menunggu'],
                    ['dikonfirmasi', 'Dikonfirmasi'],
                    ['', 'Semua'],
                ].map(([value, label]) => (
                    <button
                        key={value || 'semua'}
                        onClick={() => setFilter(value)}
                        className={`rounded-md px-3 py-1.5 text-xs font-mono border ${
                            filter === value
                                ? 'border-[#F4B400] bg-[#F4B400]/10 text-[#F4B400]'
                                : 'border-white/10 text-[#C3C9D3] hover:bg-white/5'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <Table columns={['Kode', 'Pelanggan', 'Kendaraan', 'Area', 'Tanggal & Jam', 'Status', 'Aksi']}>
                {data.map((b) => (
                    <tr key={b.id_booking}>
                        <td className="px-4 py-3 font-mono text-[#F4B400]">{b.kode_booking}</td>
                        <td className="px-4 py-3">
                            <p>{b.user?.nama_lengkap}</p>
                            <p className="text-xs text-[#8B94A3]">{b.user?.no_telp}</p>
                        </td>
                        <td className="px-4 py-3 font-mono uppercase">{b.kendaraan?.plat_nomor}</td>
                        <td className="px-4 py-3">{b.area?.nama_area}</td>
                        <td className="px-4 py-3 font-mono text-xs">
                            {new Date(b.tanggal_rencana).toLocaleDateString('id-ID')} · {b.jam_rencana_masuk?.slice(0, 5)}
                        </td>
                        <td className="px-4 py-3">
                            <Badge tone={STATUS_TONE[b.status] || 'neutral'}>{STATUS_LABEL[b.status] || b.status}</Badge>
                        </td>
                        <td className="px-4 py-3">
                            {b.status === 'menunggu' && (
                                <div className="flex gap-2">
                                    <Button onClick={() => handleKonfirmasi(b.id_booking)} disabled={processingId === b.id_booking}>
                                        Konfirmasi
                                    </Button>
                                    <Button variant="danger" onClick={() => handleTolak(b.id_booking)} disabled={processingId === b.id_booking}>
                                        Tolak
                                    </Button>
                                </div>
                            )}
                        </td>
                    </tr>
                ))}
                {!loading && data.length === 0 && (
                    <tr>
                        <td colSpan={7} className="px-4 py-6 text-center text-[#8B94A3] text-sm">
                            Tidak ada booking pada status ini.
                        </td>
                    </tr>
                )}
                {loading && (
                    <tr>
                        <td colSpan={7} className="px-4 py-6 text-center text-[#8B94A3] text-sm">
                            Memuat data...
                        </td>
                    </tr>
                )}
            </Table>
        </div>
    );
}
