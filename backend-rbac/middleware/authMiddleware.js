const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    // Mengambil token dari header 'Authorization: Bearer TOKEN'
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        // 401 Unauthorized - Jika tidak ada token sama sekali
        return res.status(401).json({ message: "Akses ditolak. Token tidak ditemukan." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            // 403 Forbidden - Jika token ada tapi tidak valid atau kedaluwarsa
            return res.status(403).json({ message: "Token tidak valid atau sudah kedaluwarsa." });
        }
        
        // Jika token valid, informasi pengguna dari token (payload) akan disimpan di 'req.user'
        req.user = user;
        
        // Lanjutkan ke proses selanjutnya (controller)
        next();
    });
};

module.exports = { authenticateToken };
