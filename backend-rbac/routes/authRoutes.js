const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Endpoint untuk registrasi: POST /api/auth/register
router.post('/register', register);

// Endpoint untuk login: POST /api/auth/login
router.post('/login', login);

module.exports = router;