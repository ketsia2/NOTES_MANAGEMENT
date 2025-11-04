const Note = require('../models/Note');
const Teacher = require('../models/Teacher');
const Subject = require('../models/Subject');
const Classe = require('../models/Classe');
const readCSV = require('../utils/csvReader');
const writeCSV = require('../utils/csvWriter');

// In-memory storage
let teachers = [];
let subjects = [];
let classes = [new Classe({ nom: 'A1 ELEC' })];

exports.getTeacherNotes = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { classe, matiere, sequence } = req.query;

    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher) {
      return res.status(404).json({ error: 'Enseignant non trouvé' });
    }

    // Get all notes for classes and subjects this teacher teaches
    let teacherNotes = [];

    classes.forEach(classe => {
      classe.notes.forEach(note => {
        if (note.enseignantId === teacherId) {
          teacherNotes.push(note);
        }
      });
    });

    // Apply filters
    if (classe) {
      teacherNotes = teacherNotes.filter(note => note.classe === classe);
    }
    if (matiere) {
      teacherNotes = teacherNotes.filter(note => note.matiereId === matiere);
    }
    if (sequence) {
      teacherNotes = teacherNotes.filter(note => note.sequence === parseInt(sequence));
    }

    res.json(teacherNotes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createTeacherNote = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const noteData = req.body;

    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher) {
      return res.status(404).json({ error: 'Enseignant non trouvé' });
    }

    // Validate that teacher can teach this subject in this class
    if (!teacher.peutEnseigner(noteData.matiereId, noteData.classe)) {
      return res.status(403).json({ error: 'Vous ne pouvez pas saisir de notes pour cette matière/classe' });
    }

    const note = new Note({
      ...noteData,
      enseignantId: teacherId
    });

    // Get subject coefficient
    const subject = subjects.find(s => s.id === noteData.matiereId);
    if (subject) {
      note.coefficient = subject.coefficient;
    }

    // Calculate average (simplified for single subject entry)
    note.moyenne = noteData.note || 0;

    const classe = classes.find(c => c.nom === note.classe) || classes[0];
    classe.ajouterNote(note);

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTeacherNote = async (req, res) => {
  try {
    const { teacherId, noteId } = req.params;
    const updateData = req.body;

    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher) {
      return res.status(404).json({ error: 'Enseignant non trouvé' });
    }

    // Find and update the note
    let foundNote = null;
    classes.forEach(classe => {
      const noteIndex = classe.notes.findIndex(n => n.id === noteId && n.enseignantId === teacherId);
      if (noteIndex !== -1) {
        Object.assign(classe.notes[noteIndex], updateData);
        foundNote = classe.notes[noteIndex];
      }
    });

    if (!foundNote) {
      return res.status(404).json({ error: 'Note non trouvée ou accès non autorisé' });
    }

    res.json(foundNote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTeacherClasses = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher) {
      return res.status(404).json({ error: 'Enseignant non trouvé' });
    }

    res.json(teacher.classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTeacherSubjects = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher) {
      return res.status(404).json({ error: 'Enseignant non trouvé' });
    }

    const teacherSubjects = subjects.filter(s => teacher.matieres.includes(s.id));
    res.json(teacherSubjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};