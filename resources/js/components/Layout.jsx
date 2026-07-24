import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MENU = {
    admin: [
        { to: '/admin', label: 'Ringkasan', end: true },
        { to: '/admin/users', label: 'Pengguna' },
        { to: '/admin/tarif', label: 'Tarif Parkir' },
        { to: '/admin/area', label: 'Area Parkir' },
        { to: '/admin/kendaraan', label: 'Kendaraan' },
        { to: '/petugas/booking', label: 'Booking Masuk' },
        { to: '/admin/log', label: 'Log Aktivitas' },
    ],
    petugas: [
        { to: '/petugas', label: 'Ringkasan', end: true },
        { to: '/petugas/masuk', label: 'Kendaraan Masuk' },
        { to: '/petugas/keluar', label: 'Kendaraan Keluar' },
        { to: '/petugas/transaksi', label: 'Riwayat Transaksi' },
        { to: '/petugas/booking', label: 'Booking Masuk' },
    ],
    owner: [
        { to: '/owner', label: 'Ringkasan', end: true },
        { to: '/owner/rekap', label: 'Rekap Transaksi' },
    ],
    pelanggan: [
        { to: '/pelanggan', label: 'Booking Parkir', end: true },
        { to: '/pelanggan/riwayat', label: 'Booking Saya' },
    ],
};

const ROLE_LABEL = {
    admin: 'Administrator',
    petugas: 'Petugas Lapangan',
    owner: 'Pemilik Usaha',
    pelanggan: 'Pelanggan',
};

export default function Layout({ children }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const menu = MENU[user?.role] || [];
    const [sidebarOpen, setSidebarOpen] = useState(false);

    async function handleLogout() {
        await logout();
        navigate('/login');
    }

    return (
        <div className="min-h-screen bg-[#14181F] text-[#EDEFF2] flex">
            {/* Overlay gelap di belakang sidebar saat dibuka di mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/60 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar: off-canvas di mobile, statis di layar md ke atas */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 w-64 shrink-0 bg-[#1B212B] border-r border-white/5 flex flex-col
                transition-transform duration-200 ease-in-out
                md:static md:translate-x-0
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="px-6 py-6 border-b border-white/5 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#F4B400]" />
                            <span className="font-display text-lg tracking-tight">
                                PANEL SISTEM PARKIR 
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-[#8B94A3] font-mono">
                            SISTEM MANAJEMEN PARKIR PELABUHAN 
                        </p>
                    </div>
                    {/* Tombol tutup, hanya tampil di mobile */}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="md:hidden text-[#8B94A3] hover:text-[#EDEFF2] p-1"
                        aria-label="Tutup menu"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {menu.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) =>
                                `block rounded-md px-3 py-2 text-sm transition-colors ${
                                    isActive
                                        ? 'bg-[#F4B400] text-[#14181F] font-medium'
                                        : 'text-[#C3C9D3] hover:bg-white/5'
                                }`
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="px-3 py-4 border-t border-white/5">
                    <div className="px-3 mb-2">
                        <p className="text-sm font-medium truncate">{user?.nama_lengkap}</p>
                        <p className="text-xs text-[#8B94A3]">{ROLE_LABEL[user?.role]}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full text-left rounded-md px-3 py-2 text-sm text-[#E5484D] hover:bg-[#E5484D]/10 transition-colors"
                    >
                        Keluar
                    </button>
                </div>
            </aside>

            {/* Konten */}
            <main className="flex-1 overflow-y-auto min-w-0">
                {/* Header mobile dengan tombol hamburger */}
                <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-[#1B212B]">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-[#EDEFF2] p-1"
                        aria-label="Buka menu"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <span className="font-display text-base tracking-tight">Parkir</span>
                </div>

                {/* garis palang khas parkir di bagian atas */}
                <div
                    className="h-1.5 w-full"
                    style={{
                        backgroundImage:
                            'repeating-linear-gradient(45deg, #F4B400 0 20px, #14181F 20px 40px)',
                    }}
                />
                <div className="p-4 md:p-8 max-w-6xl mx-auto">{children}</div>
            </main>
        </div>
    );
}