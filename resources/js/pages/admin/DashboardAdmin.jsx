import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { PageHeader, StatCard, Card, Table, Button } from '../../components/ui';
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
    Document, Packer, Paragraph, Table as DocxTable, TableRow, TableCell,
    TextRun, HeadingLevel, WidthType, AlignmentType,
} from 'docx';

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

    function handleCetak() {
        window.print();
    }

    async function handleDownloadWord() {
        const formatRupiah = (n) => 'Rp ' + Number(n).toLocaleString('id-ID');

        const headerCell = (text) =>
            new TableCell({
                shading: { fill: '1F2530' },
                children: [new Paragraph({ children: [new TextRun({ text, bold: true, color: 'FFFFFF' })] })],
            });

        const bodyCell = (text, alignment = AlignmentType.LEFT) =>
            new TableCell({ children: [new Paragraph({ text, alignment })] });

        const rows = [
            new TableRow({
                children: [
                    headerCell('Hari'),
                    headerCell('Tanggal'),
                    headerCell('Jumlah Kendaraan'),
                    headerCell('Pendapatan'),
                ],
            }),
            ...rekap.map((d) => {
                const date = new Date(d.tanggal);
                const hari = date.toLocaleDateString('id-ID', { weekday: 'long' });
                const tanggal = date.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                });
                return new TableRow({
                    children: [
                        bodyCell(hari),
                        bodyCell(tanggal),
                        bodyCell(String(d.jumlah_transaksi), AlignmentType.CENTER),
                        bodyCell(formatRupiah(d.pendapatan), AlignmentType.RIGHT),
                    ],
                });
            }),
            new TableRow({
                children: [
                    new TableCell({
                        columnSpan: 2,
                        children: [new Paragraph({ children: [new TextRun({ text: 'TOTAL', bold: true })] })],
                    }),
                    new TableCell({
                        children: [
                            new Paragraph({
                                children: [new TextRun({ text: String(totalTransaksi7Hari), bold: true })],
                                alignment: AlignmentType.CENTER,
                            }),
                        ],
                    }),
                    new TableCell({
                        children: [
                            new Paragraph({
                                children: [new TextRun({ text: formatRupiah(totalPendapatan7Hari), bold: true })],
                                alignment: AlignmentType.RIGHT,
                            }),
                        ],
                    }),
                ],
            }),
        ];

        const doc = new Document({
            sections: [
                {
                    children: [
                        new Paragraph({ heading: HeadingLevel.HEADING_1, text: 'Laporan Transaksi Parkir' }),
                        new Paragraph({ text: 'Periode: 7 Hari Terakhir', spacing: { after: 200 } }),
                        new DocxTable({ width: { size: 100, type: WidthType.PERCENTAGE }, rows }),
                        new Paragraph({ text: '', spacing: { before: 200 } }),
                        new Paragraph({ text: `Dicetak pada: ${new Date().toLocaleString('id-ID')}` }),
                    ],
                },
            ],
        });

        const blob = await Packer.toBlob(doc);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `laporan-transaksi-${new Date().toISOString().slice(0, 10)}.docx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    const totalTransaksi7Hari = rekap.reduce((sum, d) => sum + (d.jumlah_transaksi || 0), 0);
    const totalPendapatan7Hari = rekap.reduce((sum, d) => sum + (d.pendapatan || 0), 0);

    return (
        <div>
            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #laporan-print-area, #laporan-print-area * { visibility: visible; }
                    #laporan-print-area {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                    }
                    .no-print { display: none !important; }
                }
            `}</style>

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

            <div className="grid md:grid-cols-2 gap-6 mb-8 no-print">
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

            <Card className="p-6 mb-8" id="laporan-print-area">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                    <div>
                        <h2 className="font-display text-lg text-[#EDEFF2] print:text-[#14181F]">
                            Tabel Laporan Transaksi (7 Hari Terakhir)
                        </h2>
                        <p className="hidden print:block text-xs text-[#6B7280] mt-1">
                            Dicetak pada {new Date().toLocaleString('id-ID')}
                        </p>
                    </div>
                    <div className="flex gap-2 no-print">
                        <Button variant="ghost" onClick={handleDownloadWord}>
                            Download Word
                        </Button>
                        <Button variant="ghost" onClick={handleCetak}>
                            Cetak
                        </Button>
                    </div>
                </div>

                {loadingRekap ? (
                    <p className="text-sm text-[#8B94A3]">Memuat data...</p>
                ) : (
                    <Table columns={['Tanggal', 'Jumlah Transaksi', 'Pendapatan']}>
                        {rekap.map((d) => (
                            <tr key={d.tanggal}>
                                <td className="px-4 py-3 font-mono text-xs">
                                    {new Date(d.tanggal).toLocaleDateString('id-ID', {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </td>
                                <td className="px-4 py-3 font-mono">{d.jumlah_transaksi}</td>
                                <td className="px-4 py-3 font-mono">
                                    Rp {Number(d.pendapatan).toLocaleString('id-ID')}
                                </td>
                            </tr>
                        ))}
                        {rekap.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-4 py-6 text-center text-[#8B94A3] text-sm">
                                    Belum ada data transaksi.
                                </td>
                            </tr>
                        )}
                        {rekap.length > 0 && (
                            <tr className="bg-[#1F2530] font-semibold">
                                <td className="px-4 py-3 font-mono text-xs">TOTAL</td>
                                <td className="px-4 py-3 font-mono">{totalTransaksi7Hari}</td>
                                <td className="px-4 py-3 font-mono">
                                    Rp {Number(totalPendapatan7Hari).toLocaleString('id-ID')}
                                </td>
                            </tr>
                        )}
                    </Table>
                )}
            </Card>

            <Card className="p-6 no-print">
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