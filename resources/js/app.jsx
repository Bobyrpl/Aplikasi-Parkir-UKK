import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Login from './pages/Login';

import DashboardAdmin from './pages/admin/DashboardAdmin';
import Users from './pages/admin/Users';
import Tarif from './pages/admin/Tarif';
import AreaParkir from './pages/admin/AreaParkir';
import Kendaraan from './pages/admin/Kendaraan';
import LogAktivitas from './pages/admin/LogAktivitas';

import DashboardPetugas from './pages/petugas/DashboardPetugas';
import KendaraanMasuk from './pages/petugas/KendaraanMasuk';
import KendaraanKeluar from './pages/petugas/KendaraanKeluar';
import Transaksi from './pages/petugas/Transaksi';

import DashboardOwner from './pages/owner/DashboardOwner';
import Rekap from './pages/owner/Rekap';

function Beranda() {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'petugas') return <Navigate to="/petugas" replace />;
    return <Navigate to="/owner" replace />;
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Beranda />} />

                    {/* ADMIN */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <Layout><DashboardAdmin /></Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/users"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <Layout><Users /></Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/tarif"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <Layout><Tarif /></Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/area"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <Layout><AreaParkir /></Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/kendaraan"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <Layout><Kendaraan /></Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/log"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <Layout><LogAktivitas /></Layout>
                            </ProtectedRoute>
                        }
                    />

                    {/* PETUGAS */}
                    <Route
                        path="/petugas"
                        element={
                            <ProtectedRoute allowedRoles={['petugas']}>
                                <Layout><DashboardPetugas /></Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/petugas/masuk"
                        element={
                            <ProtectedRoute allowedRoles={['petugas']}>
                                <Layout><KendaraanMasuk /></Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/petugas/keluar"
                        element={
                            <ProtectedRoute allowedRoles={['petugas']}>
                                <Layout><KendaraanKeluar /></Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/petugas/transaksi"
                        element={
                            <ProtectedRoute allowedRoles={['petugas']}>
                                <Layout><Transaksi /></Layout>
                            </ProtectedRoute>
                        }
                    />

                    {/* OWNER */}
                    <Route
                        path="/owner"
                        element={
                            <ProtectedRoute allowedRoles={['owner']}>
                                <Layout><DashboardOwner /></Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/owner/rekap"
                        element={
                            <ProtectedRoute allowedRoles={['owner']}>
                                <Layout><Rekap /></Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}