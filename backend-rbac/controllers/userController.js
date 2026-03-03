const pool = require('../config/db');
const bcrypt = require('bcrypt');

// --- Fungsi Create (POST) User by Admin ---
const createUser = async (req, res) => {
    try {
        const { username, password, role_id } = req.body;

        // Validasi input dasar
        if (!username || !password || !role_id) {
            return res.status(400).json({ message: "Semua field (username, password, role_id) harus diisi." });
        }

        // Cek apakah username sudah ada
        const [existingUser] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            return res.status(409).json({ message: "Username sudah digunakan." }); // 409 Conflict
        }

        // Enkripsi password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Simpan ke database
        await pool.query(
            'INSERT INTO users (username, password, role_id) VALUES (?, ?, ?)',
            [username, hashedPassword, role_id]
        );

        res.status(201).json({ message: "Pengguna baru berhasil dibuat oleh admin." });
    } catch (error) {
        console.error("Error creating user by admin:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server saat membuat pengguna." });
    }
};

// --- Fungsi Read (GET) ---
const getAllUsers = async (req, res) => {
    try {
        const query = `
            SELECT users.id, users.username, roles.nama_role AS role 
            FROM users 
            JOIN roles ON users.role_id = roles.id 
            ORDER BY users.id ASC
        `;
        const [users] = await pool.query(query);
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching all users:", error);
        res.status(500).json({ message: "Gagal menarik data pengguna." });
    }
};

// --- Fungsi Update (PUT) ---
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, role_id } = req.body;

        if (!username || !role_id) {
            return res.status(400).json({ message: "Field username dan role_id harus diisi." });
        }

        const [result] = await pool.query(
            'UPDATE users SET username = ?, role_id = ? WHERE id = ?',
            [username, role_id, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Pengguna tidak ditemukan." });
        }

        res.status(200).json({ message: "Data pengguna berhasil diperbarui." });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

// --- Fungsi Delete (DELETE) ---
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Pengguna tidak ditemukan." });
        }

        res.status(200).json({ message: "Pengguna berhasil dihapus." });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

module.exports = { createUser, getAllUsers, updateUser, deleteUser };
