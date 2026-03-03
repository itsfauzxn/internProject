const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Inisiasi aplikasi Express
const app = express();
const PORT = process.env.PORT || 3000;

// Panggil file koneksi database (hanya untuk trigger console.log tes koneksi)
require('./config/db'); 

// Middleware wajib
app.use(cors()); // Mengizinkan Vue.js untuk mengakses API ini
app.use(express.json()); // Mengizinkan Express membaca data berformat JSON di request body

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Route percobaan dasar
app.get('/', (req, res) => {
    res.json({ status: "success", message: "API Backend RBAC berjalan dengan lancar!" });
});

// Menyalakan server
app.listen(PORT, () => {
    console.log(`🚀 Server Express berjalan di http://localhost:${PORT}`);
});