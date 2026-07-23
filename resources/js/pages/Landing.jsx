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
    },
    {
        title: 'Multi Level Akses',
        desc: 'Admin, Petugas, dan Owner masing-masing punya portal dan hak akses sendiri.',
    },
    {
        title: 'Rekap & Laporan',
        desc: 'Owner dapat memantau rekap transaksi sesuai rentang waktu yang diinginkan, kapan saja.',
    },
];

const ROLES = [
    { name: 'Admin', desc: 'Kelola user, tarif, area parkir, kendaraan & log aktivitas' },
    { name: 'Petugas', desc: 'Input transaksi masuk/keluar & cetak struk parkir' },
    { name: 'Owner', desc: 'Pantau rekap transaksi kapan pun dibutuhkan' },
];

export default function Landing() {
    const { user } = useAuth();
    const navPath = user ? dashboardPath(user.role) : '/login';
    const navLabel = user ? 'Ke Dashboard' : 'Login';

    return (
        <div className="min-h-screen bg-[#14181F] text-[#EDEFF2]">
            {/* Navbar */}
            <header className="flex items-center justify-between px-6 md:px-12 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#F4B400]" />
                    <span className="font-display text-xl tracking-tight">MANAJEMEN PARKIR PELABUHAN </span>
                </div>

                <Link
                    to={navPath}
                    className="rounded-md bg-[#F4B400] text-[#14181F] font-medium px-4 py-2 text-sm hover:bg-[#e0a800] transition-colors"
                >
                    {navLabel}
                </Link>
            </header>

            {/* Hero */}
            <section className="max-w-7xl mx-auto px-6 md:px-12 pt-10 md:pt-20 pb-16 grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <p className="text-xs font-mono text-[#F4B400] tracking-wider mb-3">
                        SISTEM MANAJEMEN PARKIR PELABUHAN TANJUNG PERAK 
                    </p>
                    <h1 className="font-display text-4xl md:text-5xl leading-tight mb-5">
                        Kelola parkir Anda,{' '}
                        <span className="text-[#F4B400]">dari pintu masuk sampai struk</span>
                    </h1>
                    <p className="text-[#8B94A3] text-base leading-relaxed mb-8 max-w-md">
                        APLIKASI Parkir menyatukan transaksi, tarif, area, dan laporan parkir
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

                {/* Visual panel */}
                <div className="relative rounded-2xl bg-[#1B212B] border border-white/5 p-8 overflow-hidden">
                    <div
                        className="absolute inset-y-0 -right-6 w-16 opacity-90"
                        style={{
                            backgroundImage:
                                'repeating-linear-gradient(-45deg, #F4B400 0 18px, #14181F 18px 36px)',
                        }}
                    />
                    <div className="relative space-y-4">
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

            {/* Features */}
            <section className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
                <div className="grid md:grid-cols-3 gap-6">
                    {FEATURES.map((f) => (
                        <div
                            key={f.title}
                            className="rounded-xl bg-[#1B212B] border border-white/5 p-6"
                        >
                            <h3 className="font-display text-lg mb-2">{f.title}</h3>
                            <p className="text-sm text-[#8B94A3] leading-relaxed">
                                {f.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex items-center justify-between text-xs text-[#8B94A3]">
                    <span>© {new Date().getFullYear()} ParkirKu</span>
                    <span className="font-mono">SISTEM MANAJEMEN PARKIR PELABUHAN TANJUNG PERAK</span>
                </div>
            </footer>
        </div>
    );
}