import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const [namaLengkap, setNamaLengkap] = useState('');
    const [username, setUsername] = useState('');
    const [noTelp, setNoTelp] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [errors, setErrors] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setErrors({});
        setLoading(true);

        try {
            await register(namaLengkap, username, noTelp, password, passwordConfirmation);
            // Role baru selalu "petugas", jadi langsung arahkan ke portal petugas
            navigate('/petugas');
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
                setError(err.response.data.message || 'Data tidak valid');
            } else {
                setError(err.response?.data?.message || 'Registrasi gagal, coba lagi');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#14181F] flex items-center justify-center p-6">
            <div className="w-full max-w-4xl grid md:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl">
                {/* Panel kiri - identitas / signature visual */}
                <div className="relative hidden md:flex flex-col justify-between bg-[#1B212B] p-10 overflow-hidden">
                    <div
                        className="absolute inset-y-0 -left-6 w-16 opacity-90"
                        style={{
                            backgroundImage:
                                'repeating-linear-gradient(-45deg, #F4B400 0 18px, #14181F 18px 36px)',
                        }}
                    />
                    <div className="relative pl-10">
                        <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#F4B400]" />
                            <span className="font-display text-2xl tracking-tight text-[#EDEFF2]">
                                SISTEM  PARKIR PELABUHAN TANJUNG PERAK
                            </span>
                        </div>
                        <p className="mt-2 text-sm text-[#8B94A3] font-mono">
                            SISTEM MANAJEMEN PARKIR PELABUHAN TANJUNG PERAK
                        </p>
                    </div>

                    <div className="relative pl-10">
                        <p className="text-[#C3C9D3] text-sm leading-relaxed">
                            Daftar sebagai petugas untuk mulai mencatat kendaraan
                            masuk dan keluar di portal ini.
                        </p>
                        <div className="mt-6 flex gap-4 text-xs font-mono text-[#8B94A3]">
                            <span>ADMIN</span>
                            <span>·</span>
                            <span>PETUGAS</span>
                            <span>·</span>
                            <span>OWNER</span>
                        </div>
                    </div>
                </div>

                {/* Panel kanan - form register */}
                <div className="bg-[#1F2530] p-10 flex flex-col justify-center">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-[#8B94A3] hover:text-[#EDEFF2] mb-6 w-fit"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Kembali ke beranda
                    </Link>

                    <h1 className="font-display text-2xl text-[#EDEFF2] mb-1">
                        Buat akun baru
                    </h1>
                    <p className="text-sm text-[#8B94A3] mb-8">
                        Akun baru terdaftar otomatis sebagai petugas.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-mono text-[#8B94A3] mb-1.5">
                                NAMA LENGKAP
                            </label>
                            <input
                                type="text"
                                value={namaLengkap}
                                onChange={(e) => setNamaLengkap(e.target.value)}
                                required
                                autoFocus
                                className="w-full rounded-md bg-[#14181F] border border-white/10 px-3 py-2.5 text-[#EDEFF2] text-sm focus:outline-none focus:ring-2 focus:ring-[#F4B400] focus:border-transparent"
                                placeholder="mis. Budi Santoso"
                            />
                            {errors.nama_lengkap && (
                                <p className="mt-1 text-xs text-[#E5484D]">{errors.nama_lengkap[0]}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-mono text-[#8B94A3] mb-1.5">
                                USERNAME
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full rounded-md bg-[#14181F] border border-white/10 px-3 py-2.5 text-[#EDEFF2] text-sm focus:outline-none focus:ring-2 focus:ring-[#F4B400] focus:border-transparent"
                                placeholder="mis. budi.santoso"
                            />
                            {errors.username && (
                                <p className="mt-1 text-xs text-[#E5484D]">{errors.username[0]}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-mono text-[#8B94A3] mb-1.5">
                                NO. TELEPON
                            </label>
                            <input
                                type="tel"
                                value={noTelp}
                                onChange={(e) => setNoTelp(e.target.value)}
                                required
                                pattern="[0-9]{10,15}"
                                className="w-full rounded-md bg-[#14181F] border border-white/10 px-3 py-2.5 text-[#EDEFF2] text-sm focus:outline-none focus:ring-2 focus:ring-[#F4B400] focus:border-transparent"
                                placeholder="mis. 081234567890"
                            />
                            {errors.no_telp && (
                                <p className="mt-1 text-xs text-[#E5484D]">{errors.no_telp[0]}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-mono text-[#8B94A3] mb-1.5">
                                PASSWORD
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full rounded-md bg-[#14181F] border border-white/10 px-3 py-2.5 text-[#EDEFF2] text-sm focus:outline-none focus:ring-2 focus:ring-[#F4B400] focus:border-transparent"
                                placeholder="minimal 6 karakter"
                            />
                            {errors.password && (
                                <p className="mt-1 text-xs text-[#E5484D]">{errors.password[0]}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-mono text-[#8B94A3] mb-1.5">
                                KONFIRMASI PASSWORD
                            </label>
                            <input
                                type="password"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                required
                                minLength={6}
                                className="w-full rounded-md bg-[#14181F] border border-white/10 px-3 py-2.5 text-[#EDEFF2] text-sm focus:outline-none focus:ring-2 focus:ring-[#F4B400] focus:border-transparent"
                                placeholder="ulangi password"
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-[#E5484D] bg-[#E5484D]/10 rounded-md px-3 py-2">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-md bg-[#F4B400] text-[#14181F] font-medium py-2.5 text-sm hover:bg-[#e0a800] transition-colors disabled:opacity-60"
                        >
                            {loading ? 'Memproses...' : 'Daftar'}
                        </button>

                        <p className="text-center text-sm text-[#8B94A3]">
                            Sudah punya akun?{' '}
                            <Link to="/login" className="text-[#F4B400] hover:underline">
                                Masuk di sini
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}