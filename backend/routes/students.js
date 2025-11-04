const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// GET /api/students - Get all students or filter by class
router.get('/', studentController.getStudents);

// POST /api/students - Create a new student
router.post('/', studentController.createStudent);

// PUT /api/students/:matricule - Update a student
router.put('/:matricule', studentController.updateStudent);

// DELETE /api/students/:matricule - Delete a student
router.delete('/:matricule', studentController.deleteStudent);

// GET /api/students/filter - Filter students
router.get('/filter', studentController.filterStudents);

module.exports = router;