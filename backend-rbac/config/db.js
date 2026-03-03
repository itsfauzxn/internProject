const mysql = require('mysql2/promise');
require('dotenv').config(); // Memanggil variabel dari .env

// Membuat pool koneksi database
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Tes apakah koneksi berhasil saat file ini dipanggil
pool.getConnection()
    .then((conn) => {
        console.log('✅ Koneksi ke database MySQL (db_rbac) berhasil!');
        conn.release(); // Lepaskan kembali koneksi ke pool
    })
    .catch((err) => {
        console.error('❌ Gagal terhubung ke database:', err.message);
    });

module.exports = pool;