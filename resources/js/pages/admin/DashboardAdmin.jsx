import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { PageHeader, StatCard, Card } from '../../components/ui';
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

export default function DashboardAdmin() {
    const [stats, setStats] = useState({ users: '—', tarif: '—', area: '—', kendaraan: '—' });
    const [rekap, setRekap] = useState([]);
    const [loadingRekap, setLoadingRekap] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const [users, tarif, area, kendaraan] = await Promise.all([
                    api.get('/users?page=1'),
                    api.get('/tarif'),
                    api.get('/area-parkir'),
                    api.get('/kendaraan?page=1'),
                ]);
                setStats({
                    users: users.data.total ?? users.data.length,
                    tarif: tarif.data.length,
                    area: area.data.length,
                    kendaraan: kendaraan.data.total ?? kendaraan.data.length,
                });
            } catch (e) {
                // biarkan tampil '—' kalau gagal fetch
            }
        }
        load();
    }, []);

    useEffect(() => {
        async function loadRekap() {
            try {
                const res = await api.get('/transaksi/rekap-harian');
                const formatted = res.data.map((d) => ({
                    ...d,
                    label: new Date(d.tanggal).toLocaleDateString('id-ID', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                    }),
                }));
                setRekap(formatted);
            } catch (e) {
                setRekap([]);
            } finally {
                setLoadingRekap(false);
            }
        }
        loadRekap();
    }, []);

    const dataRingkasan = [
        { nama: 'Pengguna', jumlah: Number(stats.users) || 0 },
        { nama: 'Tarif', jumlah: Number(stats.tarif) || 0 },
        { nama: 'Area', jumlah: Number(stats.area) || 0 },
        { nama: 'Kendaraan', jumlah: Number(stats.kendaraan) || 0 },
    ];

    return (
        <div>
            <PageHeader
                eyebrow="PANEL ADMIN"
                title="Ringkasan Sistem"
                description="Pantau data master aplikasi parkir dari sini."
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard label="TOTAL PENGGUNA" value={stats.users} />
                <StatCard label="JENIS TARIF" value={stats.tarif} accent="#35C48D" />
                <StatCard label="AREA PARKIR" value={stats.area} accent="#5B8DEF" />
                <StatCard label="KENDARAAN TERDAFTAR" value={stats.kendaraan} accent="#E5484D" />
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="p-6">
                    <h2 className="font-display text-base text-[#EDEFF2] mb-4">
                        Perbandingan Data Master
                    </h2>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={dataRingkasan}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2A303C" />
                            <XAxis dataKey="nama" stroke="#8B94A3" fontSize={12} />
                            <YAxis stroke="#8B94A3" fontSize={12} allowDecimals={false} />
                            <Tooltip
                                contentStyle={{ background: '#1F2530', border: '1px solid #2A303C', borderRadius: 8 }}
                                labelStyle={{ color: '#EDEFF2' }}
                            />
                            <Bar dataKey="jumlah" fill="#F4B400" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                <Card className="p-6">
                    <h2 className="font-display text-base text-[#EDEFF2] mb-4">
                        Tren Transaksi 7 Hari Terakhir
                    </h2>
                    {loadingRekap ? (
                        <p className="text-sm text-[#8B94A3]">Memuat data...</p>
                    ) : rekap.length === 0 ? (
                        <p className="text-sm text-[#8B94A3]">Belum ada data transaksi.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={260}>
                            <LineChart data={rekap}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2A303C" />
                                <XAxis dataKey="label" stroke="#8B94A3" fontSize={11} />
                                <YAxis stroke="#8B94A3" fontSize={12} allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{ background: '#1F2530', border: '1px solid #2A303C', borderRadius: 8 }}
                                    labelStyle={{ color: '#EDEFF2' }}
                                    formatter={(value, name) =>
                                        name === 'pendapatan'
                                            ? [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Pendapatan']
                                            : [value, 'Jumlah Transaksi']
                                    }
                                />
                                <Line
                                    type="monotone"
                                    dataKey="jumlah_transaksi"
                                    stroke="#5B8DEF"
                                    strokeWidth={2}
                                    dot={{ r: 3 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="pendapatan"
                                    stroke="#35C48D"
                                    strokeWidth={2}
                                    dot={{ r: 3 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </Card>
            </div>

            <Card className="p-6">
                <h2 className="font-display text-lg text-[#EDEFF2] mb-2">
                    Akses cepat
                </h2>
                <p className="text-sm text-[#8B94A3]">
                    Gunakan menu di sidebar untuk mengelola pengguna, tarif,
                    area parkir, data kendaraan, dan melihat log aktivitas
                    seluruh pengguna sistem.
                </p>
            </Card>
        </div>
    );
}