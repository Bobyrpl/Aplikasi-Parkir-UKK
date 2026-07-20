import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { PageHeader, Card, Table, Button, Input, Badge } from '../../components/ui';

const KOSONG = { nama_area: '', kapasitas: '' };

export default function AreaParkir() {
    const [data, setData] = useState([]);
    const [form, setForm] = useState(KOSONG);
    const [editId, setEditId] = useState(null);
    const [error, setError] = useState('');

    async function load() {
        const res = await api.get('/area-parkir');
        setData(res.data);
    }

    useEffect(() => {
        load();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        try {
            if (editId) {
                await api.put(`/area-parkir/${editId}`, form);
            } else {
                await api.post('/area-parkir', form);
            }
            setForm(KOSONG);
            setEditId(null);
            load();
        } catch (err) {
            setError('Gagal menyimpan area parkir');
        }
    }

    function handleEdit(item) {
        setEditId(item.id_area);
        setForm({ nama_area: item.nama_area, kapasitas: item.kapasitas });
    }

    async function handleDelete(id) {
        if (!confirm('Hapus area ini?')) return;
        await api.delete(`/area-parkir/${id}`);
        load();
    }

    return (
        <div>
            <PageHeader
                eyebrow="DATA MASTER"
                title="Area Parkir"
                description="Kelola zona parkir beserta kapasitasnya."
            />

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-5 md:col-span-1 h-fit">
                    <h2 className="font-display text-base text-[#EDEFF2] mb-4">
                        {editId ? 'Edit Area' : 'Tambah Area'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div>
                            <label className="block text-xs font-mono text-[#8B94A3] mb-1.5">
                                NAMA AREA
                            </label>
                            <Input
                                value={form.nama_area}
                                onChange={(e) => setForm({ ...form, nama_area: e.target.value })}
                                placeholder="mis. Area A - Motor"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-[#8B94A3] mb-1.5">
                                KAPASITAS
                            </label>
                            <Input
                                type="number"
                                min="0"
                                value={form.kapasitas}
                                onChange={(e) => setForm({ ...form, kapasitas: e.target.value })}
                                required
                            />
                        </div>

                        {error && <p className="text-sm text-[#E5484D]">{error}</p>}

                        <div className="flex gap-2 pt-2">
                            <Button type="submit">{editId ? 'Simpan' : 'Tambah'}</Button>
                            {editId && (
                                <Button type="button" variant="ghost" onClick={() => { setEditId(null); setForm(KOSONG); }}>
                                    Batal
                                </Button>
                            )}
                        </div>
                    </form>
                </Card>

                <div className="md:col-span-2">
                    <Table columns={['Nama Area', 'Kapasitas', 'Terisi', 'Status', 'Aksi']}>
                        {data.map((item) => (
                            <tr key={item.id_area}>
                                <td className="px-4 py-3">{item.nama_area}</td>
                                <td className="px-4 py-3 font-mono">{item.kapasitas}</td>
                                <td className="px-4 py-3 font-mono">{item.terisi}</td>
                                <td className="px-4 py-3">
                                    {item.terisi >= item.kapasitas ? (
                                        <Badge tone="danger">Penuh</Badge>
                                    ) : (
                                        <Badge tone="success">Tersedia</Badge>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        <Button variant="ghost" onClick={() => handleEdit(item)}>Edit</Button>
                                        <Button variant="danger" onClick={() => handleDelete(item.id_area)}>Hapus</Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-4 py-6 text-center text-[#8B94A3] text-sm">
                                    Belum ada area parkir.
                                </td>
                            </tr>
                        )}
                    </Table>
                </div>
            </div>
        </div>
    );
}
