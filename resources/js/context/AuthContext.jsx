import { createContext, useContext, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });

    async function login(username, password) {
        const res = await api.post('/login', { username, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        return res.data.user;
    }

    // Registrasi akun baru (role otomatis "pelanggan" dari backend).
    // Setelah berhasil, langsung dianggap login (backend juga mengembalikan token).
    async function register(namaLengkap, username, noTelp, password, passwordConfirmation) {
        const res = await api.post('/register', {
            nama_lengkap: namaLengkap,
            username,
            no_telp: noTelp,
            password,
            password_confirmation: passwordConfirmation,
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        return res.data.user;
    }

    async function logout() {
        try {
            await api.post('/logout');
        } catch (e) {
            // tetap lanjut hapus sesi lokal walau request logout gagal
        }
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}