const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

// GET /api/notes - Get all notes or filter by class/sequence
router.get('/', noteController.getNotes);

// POST /api/notes - Create a new note
router.post('/', noteController.createNote);

// PUT /api/notes/:nom/:sequence - Update a note
router.put('/:nom/:sequence', noteController.updateNote);

// DELETE /api/notes/:nom/:sequence - Delete a note
router.delete('/:nom/:sequence', noteController.deleteNote);

// GET /api/notes/averages - Calculate averages
router.get('/averages', noteController.calculateAverages);

module.exports = router;