const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authController = require('../controllers/authController');

// GET /api/dashboard/global - Get global school statistics (admin only)
router.get('/global', authController.authenticateToken, authController.requireAdmin, dashboardController.getGlobalStatistics);

// GET /api/dashboard/class/:className - Get class-specific statistics (admin only)
router.get('/class/:className', authController.authenticateToken, authController.requireAdmin, dashboardController.getClassStatistics);

// GET /api/dashboard/teachers - Get teacher statistics (admin only)
router.get('/teachers', authController.authenticateToken, authController.requireAdmin, dashboardController.getTeacherStatistics);

module.exports = router;