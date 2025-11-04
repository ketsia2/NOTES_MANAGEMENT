const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');
const authController = require('../controllers/authController');

// GET /api/subjects - Get all subjects
router.get('/', authController.authenticateToken, subjectController.getSubjects);

// POST /api/subjects - Create a new subject (admin only)
router.post('/', authController.authenticateToken, authController.requireAdmin, subjectController.createSubject);

// PUT /api/subjects/:id - Update a subject (admin only)
router.put('/:id', authController.authenticateToken, authController.requireAdmin, subjectController.updateSubject);

// DELETE /api/subjects/:id - Delete a subject (admin only)
router.delete('/:id', authController.authenticateToken, authController.requireAdmin, subjectController.deleteSubject);

// GET /api/subjects/:id/teachers - Get subject teachers
router.get('/:id/teachers', authController.authenticateToken, subjectController.getSubjectTeachers);

// POST /api/subjects/:id/classes/:className - Assign class to subject (admin only)
router.post('/:id/classes/:className', authController.authenticateToken, authController.requireAdmin, subjectController.assignClassToSubject);

module.exports = router;