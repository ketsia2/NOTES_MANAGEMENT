const Student = require('../models/Student');
const Classe = require('../models/Classe');
const readCSV = require('../utils/csvReader');
const writeCSV = require('../utils/csvWriter');
const fs = require('fs');

// In-memory storage for demo purposes (replace with database in production)
let classes = [
  new Classe({ nom: '6ème', niveau: '6ème', filiere: 'Général' }),
  new Classe({ nom: '5ème', niveau: '5ème', filiere: 'Général' }),
  new Classe({ nom: '4ème', niveau: '4ème', filiere: 'Général' }),
  new Classe({ nom: '3ème', niveau: '3ème', filiere: 'Général' }),
  new Classe({ nom: '2nd', niveau: '2nd', filiere: 'Général' }),
  new Classe({ nom: '1ère', niveau: '1ère', filiere: 'Général' }),
  new Classe({ nom: 'Tle', niveau: 'Tle', filiere: 'Général' })
];

const loadStudentsFromCSV = async (filePath) => {
  try {
    const data = await readCSV(filePath);
    return data.map(row => {
      const student = new Student(row);
      // Extract class name from filename
      const classMatch = filePath.match(/Liste eleves (.+)\.csv$/);
      if (classMatch) {
        student.classe = classMatch[1];
      }
      return student;
    });
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
      // Load students from specific class CSV file
      const csvFile = `./data/exemple CSV - Liste eleves ${classe}.csv`;
      try {
        students = await loadStudentsFromCSV(csvFile);
      } catch (error) {
        // If specific class file doesn't exist, return empty array
        students = [];
      }
    } else {
      // Load all students from all class CSV files
      const fs = require('fs');
      const allStudents = [];

      // List of all classes
      const classNames = ['6ème', '5ème', '4ème', '3ème', '2nd', '1ère', 'Tle'];

      for (const className of classNames) {
        const csvFile = `./data/exemple CSV - Liste eleves ${className}.csv`;
        try {
          const classStudents = await loadStudentsFromCSV(csvFile);
          allStudents.push(...classStudents);
        } catch (error) {
          // Skip if file doesn't exist
          continue;
        }
      }

      students = allStudents;
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

    // Load all students first
    const fs = require('fs');
    let students = [];

    // List of all classes
    const classNames = ['6ème', '5ème', '4ème', '3ème', '2nd', '1ère', 'Tle'];

    for (const className of classNames) {
      const csvFile = `./data/exemple CSV - Liste eleves ${className}.csv`;
      try {
        const classStudents = await loadStudentsFromCSV(csvFile);
        students.push(...classStudents);
      } catch (error) {
        // Skip if file doesn't exist
        continue;
      }
    }

    // Apply filters
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