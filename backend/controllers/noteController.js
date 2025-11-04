const Note = require('../models/Note');
const Classe = require('../models/Classe');
const readCSV = require('../utils/csvReader');
const writeCSV = require('../utils/csvWriter');

// In-memory storage for demo purposes
let classes = [new Classe({ nom: 'A1 ELEC' })];

const loadNotesFromCSV = async (filePath) => {
  try {
    const data = await readCSV(filePath);
    // Skip coefficient row and header
    const notesData = data.slice(2);
    return notesData.map(row => new Note(row));
  } catch (error) {
    throw new Error('Erreur lors du chargement des notes: ' + error.message);
  }
};

const coefficients = {
  francais: 4,
  anglais: 3,
  mathematiques: 4,
  sciencesPhysiques: 2,
  ecm: 1,
  informatique: 1,
  presentationMetier: 2,
  hygieneSecu: 1,
  technologies: 3,
  dessinTechniques: 0,
  travauxElectricite: 6,
  eps: 2,
  tm: 1
};

exports.getNotes = async (req, res) => {
  try {
    const { classe, sequence } = req.query;
    let notes = [];

    if (classe && sequence) {
      const classObj = classes.find(c => c.nom === classe);
      if (classObj) {
        notes = classObj.getNotes(parseInt(sequence));
      }
    } else {
      // Load from CSV
      notes = await loadNotesFromCSV('./data/exemple CSV - Sequence 1 A1 ELEC.csv');
    }

    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createNote = async (req, res) => {
  try {
    const noteData = req.body;
    const note = new Note(noteData);

    // Validate that teacher can teach this subject in this class
    if (note.enseignantId && note.matiereId) {
      const teacher = teachers.find(t => t.id === note.enseignantId);
      if (!teacher) {
        return res.status(400).json({ error: 'Enseignant non trouvé' });
      }
      if (!teacher.peutEnseigner(note.matiereId, note.classe)) {
        return res.status(403).json({ error: 'Cet enseignant ne peut pas enseigner cette matière dans cette classe' });
      }
    }

    note.calculateMoyenne(coefficients);

    const classe = classes.find(c => c.nom === note.classe) || classes[0];
    classe.ajouterNote(note);

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { nom, sequence } = req.params;
    const updateData = req.body;

    for (const classe of classes) {
      const noteIndex = classe.notes.findIndex(n => n.nom === nom && n.sequence === parseInt(sequence));
      if (noteIndex !== -1) {
        Object.assign(classe.notes[noteIndex], updateData);
        classe.notes[noteIndex].calculateMoyenne(coefficients);
        return res.json(classe.notes[noteIndex]);
      }
    }

    res.status(404).json({ error: 'Note non trouvée' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const { nom, sequence } = req.params;

    for (const classe of classes) {
      const noteIndex = classe.notes.findIndex(n => n.nom === nom && n.sequence === parseInt(sequence));
      if (noteIndex !== -1) {
        classe.notes.splice(noteIndex, 1);
        return res.json({ message: 'Note supprimée avec succès' });
      }
    }

    res.status(404).json({ error: 'Note non trouvée' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.calculateAverages = async (req, res) => {
  try {
    const { classe, sequence } = req.query;
    const classObj = classes.find(c => c.nom === classe) || classes[0];
    const notes = classObj.getNotes(sequence ? parseInt(sequence) : null);

    const averages = {
      classAverage: classObj.calculerMoyenneClasse(sequence ? parseInt(sequence) : null),
      studentAverages: notes.map(note => ({
        nom: note.nom,
        moyenne: note.moyenne,
        rang: note.rang
      }))
    };

    res.json(averages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};