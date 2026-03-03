const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config();

// --- 1. Fungsi Registrasi ---
const register = async (req, res) => {
    try {
        // Menerima data dari request frontend
        const { username, password, role_id } = req.body;

        // Cek apakah username sudah ada di database
        const [existingUser] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "Username sudah digunakan!" });
        }

        // Enkripsi password menggunakan bcrypt (salt rounds = 10)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Simpan data ke database
        await pool.query(
            'INSERT INTO users (username, password, role_id) VALUES (?, ?, ?)', 
            [username, hashedPassword, role_id]
        );

        res.status(201).json({ message: "Registrasi berhasil!" });
    } catch (error) {
        console.error("Error during register process:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

// --- 2. Fungsi Login ---
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Cari pengguna dan ambil nama role-nya menggunakan SQL JOIN
        const query = `
            SELECT users.id, users.username, users.password, roles.nama_role 
            FROM users 
            JOIN roles ON users.role_id = roles.id 
            WHERE users.username = ?
        `;
        const [users] = await pool.query(query, [username]);

        // Jika user tidak ditemukan
        if (users.length === 0) {
            return res.status(401).json({ message: "Username atau password salah!" });
        }

        const user = users[0];

        // Bandingkan password yang diketik dengan password yang di-hash di database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Username atau password salah!" });
        }

        // Buat JWT Token jika password cocok
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.nama_role },
            process.env.JWT_SECRET,
            { expiresIn: '2h' } // Token akan kedaluwarsa dalam 2 jam
        );

        // Kirim token dan role ke frontend
        res.json({ 
            message: "Login berhasil!", 
            token: token, 
            role: user.nama_role 
        });
    } catch (error) {
        console.error("Error during login process:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

module.exports = { register, login };