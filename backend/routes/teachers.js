const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const authController = require('../controllers/authController');

// GET /api/teachers - Get all teachers (admin only)
router.get('/', authController.authenticateToken, authController.requireAdmin, teacherController.getTeachers);

// POST /api/teachers - Create a new teacher (admin only)
router.post('/', authController.authenticateToken, authController.requireAdmin, teacherController.createTeacher);

// PUT /api/teachers/:id - Update a teacher (admin only)
router.put('/:id', authController.authenticateToken, authController.requireAdmin, teacherController.updateTeacher);

// DELETE /api/teachers/:id - Delete a teacher (admin only)
router.delete('/:id', authController.authenticateToken, authController.requireAdmin, teacherController.deleteTeacher);

// POST /api/teachers/:teacherId/subjects/:subjectId - Assign subject to teacher (admin only)
router.post('/:teacherId/subjects/:subjectId', authController.authenticateToken, authController.requireAdmin, teacherController.assignSubjectToTeacher);

// POST /api/teachers/:teacherId/classes/:className - Assign class to teacher (admin only)
router.post('/:teacherId/classes/:className', authController.authenticateToken, authController.requireAdmin, teacherController.assignClassToTeacher);

// GET /api/teachers/:id/subjects - Get teacher's subjects
router.get('/:id/subjects', authController.authenticateToken, teacherController.getTeacherSubjects);

module.exports = router;