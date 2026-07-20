import { useEffect, useState } from "react";
import api from "../../api/axios";
import { PageHeader, Card, Table, Button, Input } from "../../components/ui";

const KOSONG = {
    plat_nomor: "",
    jenis_kendaraan: "motor",
    warna: "",
    pemilik: "",
};

export default function Kendaraan() {
    const [data, setData] = useState([]);
    const [form, setForm] = useState(KOSONG);
    const [editId, setEditId] = useState(null);
    const [error, setError] = useState("");

    async function load() {
        const res = await api.get("/kendaraan");
        setData(res.data.data ?? res.data);
    }

    useEffect(() => {
        load();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        try {
            if (editId) {
                await api.put(`/kendaraan/${editId}`, form);
            } else {
                await api.post("/kendaraan", form);
            }
            setForm(KOSONG);
            setEditId(null);
            load();
        } catch (err) {
            setError("Gagal menyimpan data kendaraan");
        }
    }

    function handleEdit(item) {
        setEditId(item.id_kendaraan);
        setForm({
            plat_nomor: item.plat_nomor,
            jenis_kendaraan: item.jenis_kendaraan,
            warna: item.warna || "",
            pemilik: item.pemilik || "",
        });
    }

    async function handleDelete(id) {
        if (!confirm("Hapus data kendaraan ini?")) return;
        await api.delete(`/kendaraan/${id}`);
        load();
    }

    return (
        <div>
            <PageHeader
                eyebrow="DATA MASTER"
                title="Kendaraan"
                description="Daftar kendaraan yang tercatat dalam sistem."
            />

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-5 md:col-span-1 h-fit">
                    <h2 className="font-display text-base text-[#EDEFF2] mb-4">
                        {editId ? "Edit Kendaraan" : "Tambah Kendaraan"}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div>
                            <label className="block text-xs font-mono text-[#8B94A3] mb-1.5">
                                PLAT NOMOR
                            </label>
                            <Input
                                className="font-mono uppercase"
                                value={form.plat_nomor}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        plat_nomor: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-[#8B94A3] mb-1.5">
                                JENIS KENDARAAN
                            </label>
                            <select
                                value={form.jenis_kendaraan}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        jenis_kendaraan: e.target.value,
                                    })
                                }
                                className="w-full rounded-md bg-[#14181F] border border-white/10 px-3 py-2 text-sm text-[#EDEFF2] focus:outline-none focus:ring-2 focus:ring-[#F4B400]"
                            >
                                <option value="motor">Motor</option>
                                <option value="mobil">Mobil</option>
                                <option value="bus">Bus</option>
                                <option value="truk">Truk</option>
                                <option value="lainnya">Lainnya</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-[#8B94A3] mb-1.5">
                                WARNA
                            </label>
                            <Input
                                value={form.warna}
                                onChange={(e) =>
                                    setForm({ ...form, warna: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-[#8B94A3] mb-1.5">
                                PEMILIK
                            </label>
                            <Input
                                value={form.pemilik}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        pemilik: e.target.value,
                                    })
                                }
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-[#E5484D]">{error}</p>
                        )}

                        <div className="flex gap-2 pt-2">
                            <Button type="submit">
                                {editId ? "Simpan" : "Tambah"}
                            </Button>
                            {editId && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => {
                                        setEditId(null);
                                        setForm(KOSONG);
                                    }}
                                >
                                    Batal
                                </Button>
                            )}
                        </div>
                    </form>
                </Card>

                <div className="md:col-span-2">
                    <Table
                        columns={[
                            "Plat Nomor",
                            "Jenis",
                            "Warna",
                            "Pemilik",
                            "Aksi",
                        ]}
                    >
                        {data.map((item) => (
                            <tr key={item.id_kendaraan}>
                                <td className="px-4 py-3 font-mono uppercase">
                                    {item.plat_nomor}
                                </td>
                                <td className="px-4 py-3 capitalize">
                                    {item.jenis_kendaraan}
                                </td>
                                <td className="px-4 py-3">
                                    {item.warna || "-"}
                                </td>
                                <td className="px-4 py-3">
                                    {item.pemilik || "-"}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleEdit(item)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() =>
                                                handleDelete(item.id_kendaraan)
                                            }
                                        >
                                            Hapus
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-4 py-6 text-center text-[#8B94A3] text-sm"
                                >
                                    Belum ada data kendaraan.
                                </td>
                            </tr>
                        )}
                    </Table>
                </div>
            </div>
        </div>
    );
}
