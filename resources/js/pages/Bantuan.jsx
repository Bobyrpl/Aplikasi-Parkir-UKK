import { useState } from "react";
import { Link } from "react-router-dom";

const FAQ = [
    {
        q: "Bagaimana cara mulai menggunakan ParkirKu?",
        a: "Hubungi admin area parkir Anda untuk dibuatkan akun, lalu login sesuai peran (Admin/Petugas/Owner). Anda juga bisa mendaftar sendiri sebagai Petugas lewat halaman Daftar.",
    },
    {
        q: "Apakah bisa cetak struk otomatis?",
        a: "Bisa. Petugas dapat mencetak struk langsung dari halaman transaksi setelah kendaraan dicatat keluar.",
    },
    {
        q: "Saya lupa password akun, bagaimana cara reset?",
        a: "Saat ini reset password dilakukan oleh admin. Hubungi admin area parkir Anda melalui kontak di bawah untuk dibantu reset password.",
    },
    {
        q: "Kenapa akun saya tidak bisa login?",
        a: "Kemungkinan akun Anda sedang dinonaktifkan oleh admin, atau username/password yang dimasukkan salah. Hubungi admin untuk memastikan status akun Anda.",
    },
    {
        q: "Bagaimana cara melihat rekap transaksi?",
        a: "Khusus role Owner, rekap transaksi bisa dilihat di menu Rekap dengan memilih rentang tanggal, lalu bisa diekspor ke CSV atau dicetak.",
    },
];

const KONTAK = [
    { label: "Email Support", value: "support@parkirku.id" },
    { label: "WhatsApp Admin", value: "0812-3456-7890" },
    { label: "Jam Operasional", value: "Senin–Sabtu, 08.00–17.00 WIB" },
];

export default function Bantuan() {
    const [query, setQuery] = useState("");

    const filteredFaq = FAQ.filter(
        (f) =>
            f.q.toLowerCase().includes(query.toLowerCase()) ||
            f.a.toLowerCase().includes(query.toLowerCase()),
    );

    return (
        <div className="min-h-screen bg-[#14181F] text-[#EDEFF2]">
            <header className="max-w-4xl mx-auto px-6 md:px-12 py-6">
                <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-[#8B94A3] hover:text-[#EDEFF2] w-fit"
                >
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Kembali ke beranda
                </Link>
            </header>

            <section className="max-w-4xl mx-auto px-6 md:px-12 pt-6 pb-16">
                <p className="text-xs font-mono text-[#F4B400] tracking-wider mb-3">
                    PUSAT BANTUAN
                </p>
                <h1 className="font-display text-3xl md:text-4xl mb-3">
                    Bantuan &amp; Dukungan Akun
                </h1>
                <p className="text-sm text-[#8B94A3] max-w-xl mb-8">
                    Temukan jawaban seputar akun, login, dan penggunaan
                    ParkirKu. Tidak menemukan yang Anda cari? Hubungi tim
                    support kami.
                </p>

                <div className="mb-8">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Cari pertanyaan, mis. 'lupa password'"
                        className="w-full max-w-md rounded-md bg-[#1F2530] border border-white/10 px-3 py-2.5 text-[#EDEFF2] text-sm focus:outline-none focus:ring-2 focus:ring-[#F4B400] focus:border-transparent"
                    />
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <p className="font-display text-lg mb-4">
                            Pertanyaan umum
                        </p>
                        <div className="space-y-3">
                            {filteredFaq.map((f) => (
                                <div
                                    key={f.q}
                                    className="rounded-xl bg-[#1B212B] border border-white/5 p-5"
                                >
                                    <p className="text-sm font-medium mb-1">
                                        {f.q}
                                    </p>
                                    <p className="text-sm text-[#8B94A3]">
                                        {f.a}
                                    </p>
                                </div>
                            ))}
                            {filteredFaq.length === 0 && (
                                <p className="text-sm text-[#8B94A3]">
                                    Tidak ada pertanyaan yang cocok dengan
                                    pencarian Anda.
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <p className="font-display text-lg mb-4">
                            Hubungi kami
                        </p>
                        <div className="rounded-xl bg-[#1B212B] border border-white/5 p-5 space-y-4">
                            {KONTAK.map((k) => (
                                <div key={k.label}>
                                    <p className="text-xs font-mono text-[#8B94A3] tracking-wider mb-1">
                                        {k.label.toUpperCase()}
                                    </p>
                                    <p className="text-sm text-[#EDEFF2]">
                                        {k.value}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 rounded-xl bg-[#1B212B] border border-white/5 p-5">
                            <p className="text-sm font-medium mb-1">
                                Butuh akses akun?
                            </p>
                            <p className="text-xs text-[#8B94A3] mb-3">
                                Daftar mandiri sebagai petugas, atau masuk kalau
                                sudah punya akun.
                            </p>
                            <div className="flex gap-2">
                                <Link
                                    to="/register"
                                    className="flex-1 text-center rounded-md bg-[#F4B400] text-[#14181F] font-medium px-3 py-2 text-xs hover:bg-[#e0a800] transition-colors"
                                >
                                    Daftar
                                </Link>
                                <Link
                                    to="/login"
                                    className="flex-1 text-center rounded-md border border-white/10 text-[#EDEFF2] font-medium px-3 py-2 text-xs hover:bg-white/5 transition-colors"
                                >
                                    Masuk
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="border-t border-white/5">
                <div className="max-w-4xl mx-auto px-6 md:px-12 py-6 flex items-center justify-between text-xs text-[#8B94A3]">
                    <span>© {new Date().getFullYear()} ParkirKu</span>
                    <span className="font-mono">PUSAT BANTUAN</span>
                </div>
            </footer>
        </div>
    );
}
