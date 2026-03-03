// Definisikan base URL untuk API agar mudah diubah jika perlu
const API_BASE_URL = 'http://localhost:3000/api';

// Helper function untuk mengambil token dari Local Storage
const getToken = () => localStorage.getItem('token');

// Helper function untuk membuat header otentikasi
const getAuthHeaders = () => {
    const token = getToken();
    if (!token) return { 'Content-Type': 'application/json' };
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

/**
 * Fungsi fetch yang sudah dilengkapi penanganan error dasar dan parsing JSON.
 * @param {string} endpoint - URL endpoint setelah base URL.
 * @param {object} options - Opsi untuk fetch (method, headers, body).
 * @returns {Promise<object>} - Data dari respons JSON.
 * @throws {Error} - Jika respons network tidak OK.
 */
const apiFetch = async (endpoint, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    // Jika token ditolak, arahkan ke halaman login
    if (response.status === 401 || response.status === 403) {
        // Jangan redirect jika ini adalah percobaan login yang gagal
        if (endpoint !== '/auth/login') {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            window.location.href = 'index.html';
        }
        // Lemparkan error agar promise chain berhenti
        const data = await response.json();
        throw new Error(data.message || 'Akses ditolak atau token tidak valid.');
    }
    
    const data = await response.json();

    if (!response.ok) {
        // Lemparkan error dengan pesan dari backend jika ada
        const errorMessage = data.message || `Request gagal dengan status ${response.status}`;
        throw new Error(errorMessage);
    }

    return data;
};

// Objek global 'api' untuk menampung semua fungsi komunikasi API
const api = {
    /**
     * Login pengguna.
     * Endpoint: POST /auth/login
     */
    login: (username, password) => {
        return apiFetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
    },

    /**
     * Membuat pengguna baru (khusus admin).
     * Endpoint: POST /users
     */
    createUser: (userData) => {
        return apiFetch('/users', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(userData)
        });
    },

    /**
     * Mengambil semua pengguna.
     * Endpoint: GET /users
     */
    getUsers: () => {
        return apiFetch('/users', {
            headers: getAuthHeaders()
        });
    },

    /**
     * Memperbarui data pengguna.
     * Endpoint: PUT /users/:id
     */
    updateUser: (id, userData) => {
        return apiFetch(`/users/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(userData)
        });
    },

    /**
     * Menghapus pengguna.
     * Endpoint: DELETE /users/:id
     */
    deleteUser: (id) => {
        return apiFetch(`/users/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
    }
};

// Menjadikan 'api' tersedia secara global
window.api = api;
