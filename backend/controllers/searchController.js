const Student = require('../models/Student');
const Note = require('../models/Note');
const readCSV = require('../utils/csvReader');

exports.searchStudents = async (req, res) => {
  try {
    const { query, sexe, anciennete, classe } = req.query;
    let students = await readCSV('./data/exemple CSV - Liste eleves A1 ELEC.csv');

    // Convert to Student objects
    students = students.map(row => new Student(row));

    // Apply filters
    if (query) {
      const lowerQuery = query.toLowerCase();
      students = students.filter(student =>
        student.nom.toLowerCase().includes(lowerQuery) ||
        student.matricule.toLowerCase().includes(lowerQuery)
      );
    }

    if (sexe) {
      students = students.filter(student => student.sexe === sexe);
    }

    if (anciennete) {
      students = students.filter(student => student.anciennete === anciennete);
    }

    if (classe) {
      students = students.filter(student => student.classe === classe);
    }

    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchNotes = async (req, res) => {
  try {
    const { query, sequence, classe, minMoyenne, maxMoyenne } = req.query;
    let notes = await readCSV('./data/exemple CSV - Sequence 1 A1 ELEC.csv');

    // Skip coefficient row and convert to Note objects
    notes = notes.slice(2).map(row => new Note(row));

    // Apply filters
    if (query) {
      const lowerQuery = query.toLowerCase();
      notes = notes.filter(note => note.nom.toLowerCase().includes(lowerQuery));
    }

    if (sequence) {
      notes = notes.filter(note => note.sequence === parseInt(sequence));
    }

    if (classe) {
      notes = notes.filter(note => note.classe === classe);
    }

    if (minMoyenne) {
      notes = notes.filter(note => note.moyenne >= parseFloat(minMoyenne));
    }

    if (maxMoyenne) {
      notes = notes.filter(note => note.moyenne <= parseFloat(maxMoyenne));
    }

    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.advancedFilter = async (req, res) => {
  try {
    const filters = req.body; // Expecting an object with various filter criteria
    let students = await readCSV('./data/exemple CSV - Liste eleves A1 ELEC.csv');
    let notes = await readCSV('./data/exemple CSV - Sequence 1 A1 ELEC.csv');

    students = students.map(row => new Student(row));
    notes = notes.slice(2).map(row => new Note(row));

    // Apply student filters
    if (filters.student) {
      const studentFilters = filters.student;
      if (studentFilters.sexe) {
        students = students.filter(s => s.sexe === studentFilters.sexe);
      }
      if (studentFilters.anciennete) {
        students = students.filter(s => s.anciennete === studentFilters.anciennete);
      }
      if (studentFilters.classe) {
        students = students.filter(s => s.classe === studentFilters.classe);
      }
    }

    // Apply note filters
    if (filters.note) {
      const noteFilters = filters.note;
      if (noteFilters.sequence) {
        notes = notes.filter(n => n.sequence === parseInt(noteFilters.sequence));
      }
      if (noteFilters.minMoyenne) {
        notes = notes.filter(n => n.moyenne >= parseFloat(noteFilters.minMoyenne));
      }
      if (noteFilters.maxMoyenne) {
        notes = notes.filter(n => n.moyenne <= parseFloat(noteFilters.maxMoyenne));
      }
    }

    // Combine results
    const combinedResults = students.map(student => {
      const studentNotes = notes.filter(note => note.nom === student.nom);
      return {
        ...student,
        notes: studentNotes
      };
    });

    res.json(combinedResults);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};