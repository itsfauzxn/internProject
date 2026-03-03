/**
 * Middleware untuk memeriksa apakah pengguna yang terotentikasi memiliki peran sebagai 'admin'.
 * Middleware ini harus dijalankan SETELAH authenticateToken.
 */
const checkAdminRole = (req, res, next) => {
    // req.user seharusnya sudah diisi oleh middleware authenticateToken
    if (req.user && req.user.role === 'admin') {
        // Jika peran adalah 'admin', lanjutkan ke controller
        next();
    } else {
        // Jika bukan admin, kirim status 403 Forbidden (Dilarang)
        res.status(403).json({ message: "Akses ditolak. Aksi ini memerlukan hak akses admin." });
    }
};

module.exports = { checkAdminRole };
