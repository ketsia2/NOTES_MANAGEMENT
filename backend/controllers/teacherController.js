const Teacher = require('../models/Teacher');
const Subject = require('../models/Subject');

// In-memory storage for demo
let teachers = [];
let subjects = [];

// Initialize with default subjects
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

exports.getTeachers = async (req, res) => {
  try {
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createTeacher = async (req, res) => {
  try {
    const teacherData = req.body;
    const teacher = new Teacher(teacherData);
    teachers.push(teacher);

    res.status(201).json(teacher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const teacherIndex = teachers.findIndex(t => t.id === id);
    if (teacherIndex === -1) {
      return res.status(404).json({ error: 'Enseignant non trouvé' });
    }

    Object.assign(teachers[teacherIndex], updateData);
    res.json(teachers[teacherIndex]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const teacherIndex = teachers.findIndex(t => t.id === id);
    if (teacherIndex === -1) {
      return res.status(404).json({ error: 'Enseignant non trouvé' });
    }

    teachers.splice(teacherIndex, 1);
    res.json({ message: 'Enseignant supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.assignSubjectToTeacher = async (req, res) => {
  try {
    const { teacherId, subjectId } = req.params;

    const teacher = teachers.find(t => t.id === teacherId);
    const subject = subjects.find(s => s.id === subjectId);

    if (!teacher || !subject) {
      return res.status(404).json({ error: 'Enseignant ou matière non trouvé' });
    }

    teacher.ajouterMatiere(subjectId);
    subject.ajouterEnseignant(teacherId);

    res.json({ message: 'Matière assignée avec succès', teacher, subject });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.assignClassToTeacher = async (req, res) => {
  try {
    const { teacherId, className } = req.params;

    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher) {
      return res.status(404).json({ error: 'Enseignant non trouvé' });
    }

    teacher.ajouterClasse(className);
    res.json({ message: 'Classe assignée avec succès', teacher });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTeacherSubjects = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = teachers.find(t => t.id === id);
    if (!teacher) {
      return res.status(404).json({ error: 'Enseignant non trouvé' });
    }

    const teacherSubjects = subjects.filter(s => teacher.matieres.includes(s.id));
    res.json(teacherSubjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};