const Subject = require('../models/Subject');

// In-memory storage for demo
let subjects = [];

// Initialize with default subjects (same as in teacherController)
const initializeDefaultSubjects = () => {
  const defaultSubjects = [
    { id: '1', nom: 'Français', code: 'FR', coefficient: 4 },
    { id: '2', nom: 'Anglais', code: 'ANG', coefficient: 3 },
    { id: '3', nom: 'Mathématiques', code: 'MATH', coefficient: 4 },
    { id: '4', nom: 'Sciences Physiques', code: 'SP', coefficient: 2 },
    { id: '5', nom: 'ECM', code: 'ECM', coefficient: 1 },
    { id: '6', nom: 'Informatique', code: 'INFO', coefficient: 1 },
    { id: '7', nom: 'Présentation du Métier', code: 'PM', coefficient: 2 },
    { id: '8', nom: 'Hygiène, Sécurité, Environnement', code: 'HSE', coefficient: 1 },
    { id: '9', nom: 'Technologies', code: 'TECH', coefficient: 3 },
    { id: '10', nom: 'Dessin Techniques', code: 'DT', coefficient: 0 },
    { id: '11', nom: 'Travaux Électricité', code: 'TE', coefficient: 6 },
    { id: '12', nom: 'EPS', code: 'EPS', coefficient: 2 },
    { id: '13', nom: 'TM', code: 'TM', coefficient: 1 }
  ];

  defaultSubjects.forEach(subj => {
    const subject = new Subject(subj);
    subjects.push(subject);
  });
};

initializeDefaultSubjects();

exports.getSubjects = async (req, res) => {
  try {
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createSubject = async (req, res) => {
  try {
    const subjectData = req.body;
    const subject = new Subject(subjectData);
    subjects.push(subject);

    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const subjectIndex = subjects.findIndex(s => s.id === id);
    if (subjectIndex === -1) {
      return res.status(404).json({ error: 'Matière non trouvée' });
    }

    Object.assign(subjects[subjectIndex], updateData);
    res.json(subjects[subjectIndex]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    const subjectIndex = subjects.findIndex(s => s.id === id);
    if (subjectIndex === -1) {
      return res.status(404).json({ error: 'Matière non trouvée' });
    }

    subjects.splice(subjectIndex, 1);
    res.json({ message: 'Matière supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSubjectTeachers = async (req, res) => {
  try {
    const { id } = req.params;

    const subject = subjects.find(s => s.id === id);
    if (!subject) {
      return res.status(404).json({ error: 'Matière non trouvée' });
    }

    // This would need to be implemented with teacher data access
    // For now, return the teacher IDs
    res.json({ enseignants: subject.enseignants });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.assignClassToSubject = async (req, res) => {
  try {
    const { id, className } = req.params;

    const subject = subjects.find(s => s.id === id);
    if (!subject) {
      return res.status(404).json({ error: 'Matière non trouvée' });
    }

    subject.ajouterClasse(className);
    res.json({ message: 'Classe assignée avec succès', subject });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};