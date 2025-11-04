const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/register - Register a new user
router.post('/register', authController.register);

// POST /api/auth/login - Login user
router.post('/login', authController.login);

// GET /api/auth/profile - Get user profile (protected)
router.get('/profile', authController.authenticateToken, authController.getProfile);

module.exports = router;