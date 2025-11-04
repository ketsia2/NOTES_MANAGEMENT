const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// GET /api/reports/sequential/:classe/:sequence - Generate sequential report
router.get('/sequential/:classe/:sequence', reportController.generateSequentialReport);

// GET /api/reports/term/:classe/:trimestre - Generate term report
router.get('/term/:classe/:trimestre', reportController.generateTermReport);

// GET /api/reports/pv/:classe/:annee - Generate PV (Procès-Verbal)
router.get('/pv/:classe/:annee', reportController.generatePV);

// GET /api/reports/export/:type/:classe/:period - Export report as CSV
router.get('/export/:type/:classe/:period', reportController.exportReport);

module.exports = router;