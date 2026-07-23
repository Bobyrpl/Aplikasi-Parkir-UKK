import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { PageHeader, Card, Table, Button, Input, Badge } from '../../components/ui';

const KOSONG = { nama_lengkap: '', username: '', no_telp: '', password: '', role: 'petugas', status_aktif: true };

export default function Users() {
    const [data, setData] = useState([]);
    const [form, setForm] = useState(KOSONG);
    const [editId, setEditId] = useState(null);
    const [error, setError] = useState('');

    async function load() {
        const res = await api.get('/users');
        setData(res.data.data ?? res.data);
    }

    useEffect(() => {
        load();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        try {
            const payload = { ...form };
            if (editId && !payload.password) delete payload.password;

            if (editId) {
                await api.put(`/users/${editId}`, payload);
            } else {
                await api.post('/users', payload);
            }
            setForm(KOSONG);
            setEditId(null);
            load();
        } catch (err) {
            setError(err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(', ') : 'Gagal menyimpan pengguna');
        }
    }

    function handleEdit(item) {
        setEditId(item.id_user);
        setForm({
            nama_lengkap: item.nama_lengkap,
            username: item.username,
            no_telp: item.no_telp ?? '',
            password: '',
            role: item.role,
            status_aktif: !!item.status_aktif,
        });
    }

    async function handleDelete(id) {
        if (!confirm('Hapus pengguna ini?')) return;
        await api.delete(`/users/${id}`);
        load();
    }

    return (
        <div>
            <PageHeader
                eyebrow="DATA MASTER"
                title="Pengguna"
                description="Kelola akun admin, petugas, dan owner."
            />

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-5 md:col-span-1 h-fit">
                    <h2 className="font-display text-base text-[#EDEFF2] mb-4">
                        {editId ? 'Edit Pengguna' : 'Tambah Pengguna'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div>
                            <label className="block text-xs font-mono text-[#8B94A3] mb-1.5">NAMA LENGKAP</label>
                            <Input value={form.nama_lengkap} onChange={(e) => setForm({ ...form, nama_lengkap: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-[#8B94A3] mb-1.5">USERNAME</label>
                            <Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-[#8B94A3] mb-1.5">NO. TELEPON</label>
                            <Input value={form.no_telp} onChange={(e) => setForm({ ...form, no_telp: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-[#8B94A3] mb-1.5">
                                PASSWORD {editId && <span className="normal-case">(kosongkan jika tidak diubah)</span>}
                            </label>
                            <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!editId} />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-[#8B94A3] mb-1.5">ROLE</label>
                            <select
                                value={form.role}
                                onChange={(e) => setForm({ ...form, role: e.target.value })}
                                className="w-full rounded-md bg-[#14181F] border border-white/10 px-3 py-2 text-sm text-[#EDEFF2] focus:outline-none focus:ring-2 focus:ring-[#F4B400]"
                            >
                                <option value="admin">Admin</option>
                                <option value="petugas">Petugas</option>
                                <option value="owner">Owner</option>
                            </select>
                        </div>
                        <label className="flex items-center gap-2 text-sm text-[#C3C9D3]">
                            <input
                                type="checkbox"
                                checked={form.status_aktif}
                                onChange={(e) => setForm({ ...form, status_aktif: e.target.checked })}
                            />
                            Akun aktif
                        </label>

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
                    <Table columns={['Nama', 'Username', 'No. Telepon', 'Role', 'Status', 'Aksi']}>
                        {data.map((item) => (
                            <tr key={item.id_user}>
                                <td className="px-4 py-3">{item.nama_lengkap}</td>
                                <td className="px-4 py-3 font-mono">{item.username}</td>
                                <td className="px-4 py-3 font-mono">{item.no_telp || '—'}</td>
                                <td className="px-4 py-3 capitalize">{item.role}</td>
                                <td className="px-4 py-3">
                                    {item.status_aktif ? <Badge tone="success">Aktif</Badge> : <Badge tone="danger">Nonaktif</Badge>}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        <Button variant="ghost" onClick={() => handleEdit(item)}>Edit</Button>
                                        <Button variant="danger" onClick={() => handleDelete(item.id_user)}>Hapus</Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-4 py-6 text-center text-[#8B94A3] text-sm">
                                    Belum ada pengguna.
                                </td>
                            </tr>
                        )}
                    </Table>
                </div>
            </div>
        </div>
    );
}