import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function dashboardPath(role) {
    if (role === 'admin') return '/admin';
    if (role === 'petugas') return '/petugas';
    return '/owner';
}

const FEATURES = [
    {
        title: 'Transaksi Cepat',
        desc: 'Catat kendaraan masuk dan keluar dalam hitungan detik, lengkap dengan cetak struk otomatis.',
        icon: (
            <path d="M4 12h16M4 12l4-4M4 12l4 4" stroke="#F4B400" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        ),
    },
    {
        title: 'Multi Level Akses',
        desc: 'Admin, Petugas, dan Owner masing-masing punya portal dan hak akses sendiri.',
        icon: (
            <path d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 20c0-4 3.5-6 8-6s8 2 8 6" stroke="#F4B400" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        ),
    },
    {
        title: 'Rekap & Laporan',
        desc: 'Owner dapat memantau rekap transaksi sesuai rentang waktu yang diinginkan, kapan saja.',
        icon: (
            <path d="M5 20V10M12 20V4M19 20v-7" stroke="#F4B400" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        ),
    },
];

const ROLES = [
    { name: 'Admin', desc: 'Kelola user, tarif, area parkir, kendaraan & log aktivitas' },
    { name: 'Petugas', desc: 'Input transaksi masuk/keluar & cetak struk parkir' },
    { name: 'Owner', desc: 'Pantau rekap transaksi kapan pun dibutuhkan' },
];

const TESTIMONI = [
    { nama: 'Rina, Pengelola Mall', teks: 'Antrean di pintu keluar jauh lebih cepat sejak pakai ParkirKu.', bintang: 5 },
    { nama: 'Dedi, Petugas Lapangan', teks: 'Cetak struknya praktis, tidak perlu catat manual lagi.', bintang: 5 },
    { nama: 'Sari, Owner Area Parkir', teks: 'Rekap transaksi bisa saya cek dari mana saja.', bintang: 4 },
];

const GRAFIK_DATA = [
    { label: 'Sen', val: 40 },
    { label: 'Sel', val: 55 },
    { label: 'Rab', val: 48 },
    { label: 'Kam', val: 70 },
    { label: 'Jum', val: 90 },
    { label: 'Sab', val: 65 },
];

function Bintang({ jumlah }) {
    return (
        <div style={{ display: 'flex', gap: 2 }} aria-label={`${jumlah} dari 5 bintang`}>
            {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} width="14" height="14" viewBox="0 0 20 20" aria-hidden="true">
                    <path
                        d="M10 1l2.6 5.9 6.4.6-4.8 4.3 1.4 6.2L10 14.9 4.4 18l1.4-6.2L1 7.5l6.4-.6L10 1z"
                        fill={i <= jumlah ? '#F4B400' : '#3A3F49'}
                    />
                </svg>
            ))}
        </div>
    );
}

export default function Landing() {
    const { user } = useAuth();
    const navPath = user ? dashboardPath(user.role) : '/login';
    const navLabel = user ? 'Ke Dashboard' : 'Login';
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [helpOpen, setHelpOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#14181F] text-[#EDEFF2] relative">
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 flex">
                    <div
                        className="fixed inset-0 bg-black/60"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <div className="relative w-64 bg-[#1B212B] h-full p-6 flex flex-col gap-4 z-50">
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-display text-lg">Menu</span>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                aria-label="Tutup menu"
                                className="text-[#8B94A3]"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>
                        <a href="#fitur" onClick={() => setSidebarOpen(false)} className="text-sm text-[#C3C9D3] py-2 border-b border-white/5">Fitur</a>
                        <a href="#informasi" onClick={() => setSidebarOpen(false)} className="text-sm text-[#C3C9D3] py-2 border-b border-white/5">Informasi</a>
                        <a href="#testimoni" onClick={() => setSidebarOpen(false)} className="text-sm text-[#C3C9D3] py-2 border-b border-white/5">Testimoni</a>
                        <Link to="/bantuan" onClick={() => setSidebarOpen(false)} className="text-sm text-[#C3C9D3] py-2 border-b border-white/5">Bantuan</Link>
                        <Link to={navPath} onClick={() => setSidebarOpen(false)} className="mt-2 rounded-md bg-[#F4B400] text-[#14181F] font-medium px-4 py-2 text-sm text-center">
                            {navLabel}
                        </Link>
                    </div>
                </div>
            )}

            <header className="flex items-center justify-between px-6 md:px-12 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Buka menu"
                        className="md:hidden text-[#EDEFF2]"
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#F4B400]" />
                        <span className="font-display text-xl tracking-tight">Parkir Pelabuhan Tanjung Perak</span>
                    </div>
                </div>

                <nav className="hidden md:flex items-center gap-6 text-sm text-[#8B94A3]">
                    <a href="#fitur" className="hover:text-[#EDEFF2]">Fitur</a>
                    <a href="#informasi" className="hover:text-[#EDEFF2]">Informasi</a>
                    <a href="#testimoni" className="hover:text-[#EDEFF2]">Testimoni</a>
                    <Link to="/bantuan" className="hover:text-[#EDEFF2]">Bantuan</Link>
                </nav>

                <Link
                    to={navPath}
                    className="rounded-md bg-[#F4B400] text-[#14181F] font-medium px-4 py-2 text-sm hover:bg-[#e0a800] transition-colors"
                >
                    {navLabel}
                </Link>
            </header>

            <section className="max-w-7xl mx-auto px-6 md:px-12 pt-10 md:pt-20 pb-16 grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <p className="text-xs font-mono text-[#F4B400] tracking-wider">
                            SISTEM MANAJEMEN PARKIR
                        </p>
                        <span className="rounded-full bg-[#F4B400]/15 text-[#F4B400] text-xs font-mono px-2 py-0.5 flex items-center gap-1">
                            <Bintang jumlah={5} /> 4.8
                        </span>
                    </div>
                    <h1 className="font-display text-4xl md:text-5xl leading-tight mb-5">
                        Kelola parkir Anda,{' '}
                        <span className="text-[#F4B400]">dari pintu masuk sampai struk</span>
                    </h1>
                    <p className="text-[#8B94A3] text-base leading-relaxed mb-8 max-w-md">
                        ParkirKu menyatukan transaksi, tarif, area, dan laporan parkir
                        dalam satu portal — dengan akses berbeda untuk Admin, Petugas,
                        dan Owner.
                    </p>
                    <div className="flex items-center gap-4">
                        <Link
                            to={navPath}
                            className="rounded-md bg-[#F4B400] text-[#14181F] font-medium px-6 py-3 text-sm hover:bg-[#e0a800] transition-colors"
                        >
                            {user ? 'Ke Dashboard' : 'Masuk ke Portal'}
                        </Link>
                        <div className="flex gap-3 text-xs font-mono text-[#8B94A3]">
                            <span>ADMIN</span>
                            <span>·</span>
                            <span>PETUGAS</span>
                            <span>·</span>
                            <span>OWNER</span>
                        </div>
                    </div>
                </div>

                <div className="relative rounded-2xl bg-[#1B212B] border border-white/5 p-8 overflow-hidden">
                    <div
                        className="absolute inset-y-0 -right-6 w-16 opacity-90"
                        style={{
                            backgroundImage:
                                'repeating-linear-gradient(-45deg, #F4B400 0 18px, #14181F 18px 36px)',
                        }}
                    />
                    {/* Foto area parkir. Taruh file gambar Anda di public/images/hero-parkir.jpg.
                        Kalau file belum ada / gagal dimuat, otomatis fallback ke ilustrasi SVG di bawah. */}
                    <img
                        src="/images/gambar.jpg"
                        alt="Area parkir ParkirKu"
                        className="relative w-full h-48 md:h-56 object-cover rounded-xl mb-4"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling.style.display = 'block';
                        }}
                    />
                    <svg viewBox="0 0 320 200" className="relative w-full mb-4" style={{ display: 'none' }} aria-hidden="true">
                        <rect x="10" y="140" width="300" height="10" rx="2" fill="#2A303B" />
                        <rect x="30" y="80" width="60" height="60" rx="8" fill="#F4B400" opacity="0.9" />
                        <rect x="110" y="60" width="70" height="80" rx="8" fill="#5DCAA5" opacity="0.85" />
                        <rect x="200" y="95" width="60" height="45" rx="8" fill="#D4537E" opacity="0.85" />
                        <rect x="140" y="20" width="8" height="60" fill="#8B94A3" />
                        <rect x="120" y="14" width="48" height="14" rx="3" fill="#EDEFF2" />
                        <circle cx="144" cy="21" r="4" fill="#E24B4A" />
                    </svg>
                    <div className="relative space-y-3">
                        {ROLES.map((r) => (
                            <div
                                key={r.name}
                                className="rounded-xl bg-[#1F2530] border border-white/5 p-4"
                            >
                                <p className="font-display text-sm text-[#F4B400] mb-1">
                                    {r.name}
                                </p>
                                <p className="text-sm text-[#C3C9D3]">{r.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="fitur" className="max-w-7xl mx-auto px-6 md:px-12 pb-16">
                <div className="grid md:grid-cols-3 gap-6">
                    {FEATURES.map((f) => (
                        <div
                            key={f.title}
                            className="rounded-xl bg-[#1B212B] border border-white/5 p-6"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mb-3" aria-hidden="true">
                                {f.icon}
                            </svg>
                            <h3 className="font-display text-lg mb-2">{f.title}</h3>
                            <p className="text-sm text-[#8B94A3] leading-relaxed">
                                {f.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-6 md:px-12 pb-16">
                <div className="rounded-xl bg-[#1B212B] border border-white/5 p-6">
                    <p className="font-display text-lg mb-1">Kepadatan transaksi mingguan</p>
                    <p className="text-sm text-[#8B94A3] mb-6">Contoh grafik jumlah transaksi per hari</p>
                    <div className="flex items-end gap-4 h-32">
                        {GRAFIK_DATA.map((d) => (
                            <div
                                key={d.label}
                                className="flex flex-col items-center justify-end gap-2 flex-1 self-stretch"
                            >
                                <div
                                    className="w-full rounded-t-md bg-[#F4B400]"
                                    style={{ height: `${d.val}%` }}
                                />
                                <span className="text-xs text-[#8B94A3] font-mono">{d.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-6 md:px-12 pb-16 grid md:grid-cols-2 gap-6">
                <div className="rounded-xl bg-[#1B212B] border border-white/5 p-6">
                    <p className="font-display text-lg mb-2">Notifikasi transaksi</p>
                    <p className="text-sm text-[#8B94A3] mb-4">
                        Dengarkan contoh bunyi notifikasi saat kendaraan masuk/keluar.
                    </p>
                    <audio controls className="w-full" src="/media/notifikasi-demo.mp3">
                        Browser Anda tidak mendukung pemutaran audio.
                    </audio>
                </div>
                <div className="rounded-xl bg-[#1B212B] border border-white/5 p-6">
                    <p className="font-display text-lg mb-2">Cara kerja ParkirKu</p>
                    <p className="text-sm text-[#8B94A3] mb-4">
                        Video singkat alur transaksi masuk sampai cetak struk.
                    </p>
                    <video controls className="w-full rounded-lg" poster="/media/video-poster.jpg" src="/media/demo-parkirku.mp4">
                        Browser Anda tidak mendukung pemutaran video.
                    </video>
                </div>
            </section>

            <section id="informasi" className="max-w-7xl mx-auto px-6 md:px-12 pb-16">
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="rounded-xl bg-[#1B212B] border border-white/5 p-6">
                        <p className="text-xs font-mono text-[#8B94A3] mb-2 tracking-wider">SLOT TERSEDIA SAAT INI</p>
                        <p className="font-display text-3xl text-[#5DCAA5]">42 / 80</p>
                        <p className="text-sm text-[#8B94A3] mt-1">Diperbarui otomatis secara real-time</p>
                    </div>
                    <div className="rounded-xl bg-[#1B212B] border border-white/5 p-6">
                        <p className="text-xs font-mono text-[#8B94A3] mb-2 tracking-wider">KUALITAS LAYANAN</p>
                        <div className="flex items-center gap-2">
                            <p className="font-display text-3xl text-[#F4B400]">4.8</p>
                            <Bintang jumlah={5} />
                        </div>
                        <p className="text-sm text-[#8B94A3] mt-1">Dari 320+ ulasan pengguna</p>
                    </div>
                    <div className="rounded-xl bg-[#1B212B] border border-white/5 p-6">
                        <p className="text-xs font-mono text-[#8B94A3] mb-2 tracking-wider">TRANSAKSI SELESAI</p>
                        <p className="font-display text-3xl text-[#EDEFF2]">12.480+</p>
                        <p className="text-sm text-[#8B94A3] mt-1">Diproses sejak ParkirKu digunakan</p>
                    </div>
                </div>
            </section>

            <section id="testimoni" className="max-w-7xl mx-auto px-6 md:px-12 pb-16">
                <p className="font-display text-lg mb-6">Apa kata pengguna</p>
                <div className="grid md:grid-cols-3 gap-6">
                    {TESTIMONI.map((t) => (
                        <div key={t.nama} className="rounded-xl bg-[#1B212B] border border-white/5 p-6">
                            <Bintang jumlah={t.bintang} />
                            <p className="text-sm text-[#C3C9D3] mt-3 mb-4 leading-relaxed">"{t.teks}"</p>
                            <p className="text-xs font-mono text-[#8B94A3]">{t.nama}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section id="bantuan" className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
                <div className="rounded-xl bg-[#1B212B] border border-white/5 p-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <p className="font-display text-lg mb-1">Butuh bantuan?</p>
                        <p className="text-sm text-[#8B94A3]">
                            Lihat pertanyaan umum seputar akun dan cara pakai ParkirKu di halaman Bantuan.
                        </p>
                    </div>
                    <Link
                        to="/bantuan"
                        className="rounded-md bg-[#F4B400] text-[#14181F] font-medium px-5 py-2.5 text-sm hover:bg-[#e0a800] transition-colors whitespace-nowrap"
                    >
                        Buka Halaman Bantuan
                    </Link>
                </div>
            </section>

            <div className="fixed bottom-6 right-6 z-50">
                {helpOpen && (
                    <div className="mb-3 w-64 rounded-xl bg-[#1B212B] border border-white/10 p-4">
                        <p className="text-sm font-medium mb-1">Butuh bantuan?</p>
                        <p className="text-xs text-[#8B94A3] mb-3">
                            Hubungi admin area parkir Anda atau lihat FAQ di atas.
                        </p>
                        <Link to="/bantuan" onClick={() => setHelpOpen(false)} className="text-xs text-[#F4B400]">
                            Buka Halaman Bantuan →
                        </Link>
                    </div>
                )}
                <button
                    onClick={() => setHelpOpen((v) => !v)}
                    aria-label="Bantuan"
                    className="h-12 w-12 rounded-full bg-[#F4B400] text-[#14181F] flex items-center justify-center shadow-lg"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                        <path d="M9.5 9a2.5 2.5 0 115 .5c0 1.5-2.5 1.5-2.5 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="12" cy="17" r="1" fill="currentColor" />
                    </svg>
                </button>
            </div>

            <footer className="border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex items-center justify-between text-xs text-[#8B94A3]">
                    <span>© {new Date().getFullYear()} Parkir Pelabuhan Tanjung Perak</span>
                    <span className="font-mono">SISTEM MANAJEMEN PARKIR</span>
                </div>
            </footer>
        </div>
    );
}