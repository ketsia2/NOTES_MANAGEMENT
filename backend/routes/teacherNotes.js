 const express = require('express');
const router = express.Router();
const teacherNoteController = require('../controllers/teacherNoteController');
const authController = require('../controllers/authController');

// GET /api/teacher-notes/:teacherId - Get notes for a specific teacher
router.get('/:teacherId', authController.authenticateToken, teacherNoteController.getTeacherNotes);

// POST /api/teacher-notes/:teacherId - Create a note for a specific teacher
router.post('/:teacherId', authController.authenticateToken, authController.requireTeacher, teacherNoteController.createTeacherNote);

// PUT /api/teacher-notes/:teacherId/:noteId - Update a specific note
router.put('/:teacherId/:noteId', authController.authenticateToken, authController.requireTeacher, teacherNoteController.updateTeacherNote);

// GET /api/teacher-notes/:teacherId/classes - Get teacher's classes
router.get('/:teacherId/classes', authController.authenticateToken, teacherNoteController.getTeacherClasses);

// GET /api/teacher-notes/:teacherId/subjects - Get teacher's subjects
router.get('/:teacherId/subjects', authController.authenticateToken, teacherNoteController.getTeacherSubjects);

module.exports = router;