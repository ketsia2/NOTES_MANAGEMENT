const Student = require('../models/Student');
const Classe = require('../models/Classe');
const readCSV = require('../utils/csvReader');
const writeCSV = require('../utils/csvWriter');
const fs = require('fs');

// In-memory storage for demo purposes (replace with database in production)
let classes = [new Classe({ nom: 'A1 ELEC' })];

const loadStudentsFromCSV = async (filePath) => {
  try {
    const data = await readCSV(filePath);
    return data.map(row => new Student(row));
  } catch (error) {
    throw new Error('Erreur lors du chargement des élèves: ' + error.message);
  }
};

const saveStudentsToCSV = async (students, filePath) => {
  try {
    await writeCSV(filePath, students);
  } catch (error) {
    throw new Error('Erreur lors de la sauvegarde des élèves: ' + error.message);
  }
};

exports.getStudents = async (req, res) => {
  try {
    const { classe } = req.query;
    let students = [];

    if (classe) {
      const classObj = classes.find(c => c.nom === classe);
      if (classObj) {
        students = classObj.getEleves();
      }
    } else {
      // Load from CSV if no specific class
      students = await loadStudentsFromCSV('./data/exemple CSV - Liste eleves A1 ELEC.csv');
    }

    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const studentData = req.body;
    const student = new Student(studentData);
    const classe = classes.find(c => c.nom === student.classe) || classes[0];
    classe.ajouterEleve(student);

    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { matricule } = req.params;
    const updateData = req.body;

    for (const classe of classes) {
      const studentIndex = classe.eleves.findIndex(s => s.matricule === matricule);
      if (studentIndex !== -1) {
        Object.assign(classe.eleves[studentIndex], updateData);
        return res.json(classe.eleves[studentIndex]);
      }
    }

    res.status(404).json({ error: 'Élève non trouvé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const { matricule } = req.params;

    for (const classe of classes) {
      const studentIndex = classe.eleves.findIndex(s => s.matricule === matricule);
      if (studentIndex !== -1) {
        classe.eleves.splice(studentIndex, 1);
        return res.json({ message: 'Élève supprimé avec succès' });
      }
    }

    res.status(404).json({ error: 'Élève non trouvé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.filterStudents = async (req, res) => {
  try {
    const { sexe, anciennete, classe } = req.query;
    let students = await loadStudentsFromCSV('./data/exemple CSV - Liste eleves A1 ELEC.csv');

    if (sexe) {
      students = students.filter(s => s.sexe === sexe);
    }
    if (anciennete) {
      students = students.filter(s => s.anciennete === anciennete);
    }
    if (classe) {
      students = students.filter(s => s.classe === classe);
    }

    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};