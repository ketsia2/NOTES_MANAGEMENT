const Student = require('../models/Student');
const Note = require('../models/Note');
const Teacher = require('../models/Teacher');
const Classe = require('../models/Classe');
const readCSV = require('../utils/csvReader');

// In-memory references (would be replaced with proper data access)
let teachers = [];
let classes = [
  new Classe({ nom: '6ème', niveau: '6ème', filiere: 'Général' }),
  new Classe({ nom: '5ème', niveau: '5ème', filiere: 'Général' }),
  new Classe({ nom: '4ème', niveau: '4ème', filiere: 'Général' }),
  new Classe({ nom: '3ème', niveau: '3ème', filiere: 'Général' }),
  new Classe({ nom: '2nd', niveau: '2nd', filiere: 'Général' }),
  new Classe({ nom: '1ère', niveau: '1ère', filiere: 'Général' }),
  new Classe({ nom: 'Tle', niveau: 'Tle', filiere: 'Général' })
];

exports.getGlobalStatistics = async (req, res) => {
  try {
    // Load all students from all class CSV files
    const fs = require('fs');
    let allStudents = [];
    let allNotes = [];

    // List of all classes
    const classNames = ['6ème', '5ème', '4ème', '3ème', '2nd', '1ère', 'Tle'];

    for (const className of classNames) {
      // Load students for this class
      const studentCsvFile = `./data/exemple CSV - Liste eleves ${className}.csv`;
      try {
        const classStudents = await readCSV(studentCsvFile);
        allStudents.push(...classStudents);
      } catch (error) {
        // Skip if file doesn't exist
        continue;
      }

      // Load notes for this class (if available)
      const notesCsvFile = `./data/exemple CSV - Sequence 1 ${className}.csv`;
      try {
        const classNotes = await readCSV(notesCsvFile);
        const noteObjects = classNotes.slice(2).map(row => new Note(row));
        allNotes.push(...noteObjects);
      } catch (error) {
        // Skip if file doesn't exist
        continue;
      }
    }

    const students = allStudents;
    const noteObjects = allNotes;

    const stats = {
      totalStudents: students.length,
      totalTeachers: teachers.length,
      totalClasses: classes.length,
      averageClassSize: students.length / classes.length,
      genderDistribution: {
        male: students.filter(s => s.sexe === 'M').length,
        female: students.filter(s => s.sexe === 'F').length
      },
      seniorityDistribution: {
        nouveau: students.filter(s => s.anciennete === 'Nouveau').length,
        triple: students.filter(s => s.anciennete === 'Triple').length
      },
      overallAverage: noteObjects.length > 0 ? noteObjects.reduce((sum, note) => sum + note.moyenne, 0) / noteObjects.length : 0,
      topPerformers: noteObjects.length > 0 ? noteObjects
        .sort((a, b) => b.moyenne - a.moyenne)
        .slice(0, 5)
        .map(note => ({ nom: note.nom, moyenne: note.moyenne, rang: note.rang })) : [],
      dateGenerated: new Date().toISOString()
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getClassStatistics = async (req, res) => {
  try {
    const { className } = req.params;

    // Load students for the class
    const students = await readCSV('./data/exemple CSV - Liste eleves A1 ELEC.csv');

    // Load notes for the class
    const notes = await readCSV('./data/exemple CSV - Sequence 1 A1 ELEC.csv');
    const noteObjects = notes.slice(2).map(row => new Note(row));

    const classStats = {
      className: className,
      totalStudents: students.length,
      genderDistribution: {
        male: students.filter(s => s.SEXE === 'M').length,
        female: students.filter(s => s.SEXE === 'F').length
      },
      seniorityDistribution: {
        nouveau: students.filter(s => s.ANCIENNETE === 'Nouveau').length,
        triple: students.filter(s => s.ANCIENNETE === 'Triple').length
      },
      classAverage: noteObjects.reduce((sum, note) => sum + note.moyenne, 0) / noteObjects.length,
      bestStudent: noteObjects.reduce((best, current) =>
        current.moyenne > best.moyenne ? current : best
      ),
      ranking: noteObjects
        .sort((a, b) => b.moyenne - a.moyenne)
        .map((note, index) => ({
          rank: index + 1,
          nom: note.nom,
          moyenne: note.moyenne
        })),
      subjectAverages: calculateSubjectAverages(noteObjects),
      dateGenerated: new Date().toISOString()
    };

    res.json(classStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTeacherStatistics = async (req, res) => {
  try {
    const teacherStats = teachers.map(teacher => ({
      id: teacher.id,
      nom: `${teacher.nom} ${teacher.prenoms}`,
      matieres: teacher.matieres.length,
      classes: teacher.classes.length,
      // Additional stats would be calculated based on notes taught
      dateGenerated: new Date().toISOString()
    }));

    res.json(teacherStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const calculateSubjectAverages = (notes) => {
  const subjects = [
    'francais', 'anglais', 'mathematiques', 'sciencesPhysiques', 'ecm',
    'informatique', 'presentationMetier', 'hygieneSecu', 'technologies',
    'dessinTechniques', 'travauxElectricite', 'eps', 'tm'
  ];

  const averages = {};

  subjects.forEach(subject => {
    const subjectNotes = notes
      .map(note => note[subject])
      .filter(note => note !== undefined && note !== null && !isNaN(parseFloat(note)));

    if (subjectNotes.length > 0) {
      averages[subject] = subjectNotes.reduce((sum, note) => sum + parseFloat(note), 0) / subjectNotes.length;
    } else {
      averages[subject] = 0;
    }
  });

  return averages;
};