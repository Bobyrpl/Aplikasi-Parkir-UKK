import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        Accept: 'application/json',
    },
});

// Selipkan token Sanctum ke setiap request otomatis
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
// Kalau token invalid/expired, otomatis lempar ke halaman login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
