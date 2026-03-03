const express = require('express');
const router = express.Router();
const { createUser, getAllUsers, updateUser, deleteUser } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { checkAdminRole } = require('../middleware/roleMiddleware');

// Rute yang bisa diakses oleh semua pengguna yang sudah login
// GET /api/users - Menarik daftar semua pengguna
router.get('/', authenticateToken, getAllUsers);

// Rute-rute di bawah ini hanya bisa diakses oleh ADMIN

// POST /api/users - Membuat pengguna baru (khusus admin)
router.post('/', authenticateToken, checkAdminRole, createUser);

// PUT /api/users/:id - Mengedit pengguna (khusus admin)
router.put('/:id', authenticateToken, checkAdminRole, updateUser);

// DELETE /api/users/:id - Menghapus pengguna (khusus admin)
router.delete('/:id', authenticateToken, checkAdminRole, deleteUser);

module.exports = router;
