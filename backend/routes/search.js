const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// GET /api/search/students - Search and filter students
router.get('/students', searchController.searchStudents);

// GET /api/search/notes - Search and filter notes
router.get('/notes', searchController.searchNotes);

// POST /api/search/advanced - Advanced filtering combining students and notes
router.post('/advanced', searchController.advancedFilter);

module.exports = router;