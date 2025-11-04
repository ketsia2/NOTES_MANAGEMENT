const Note = require('../models/Note');
const Student = require('../models/Student');
const readCSV = require('../utils/csvReader');
const writeCSV = require('../utils/csvWriter');
const fs = require('fs');

exports.generateSequentialReport = async (req, res) => {
  try {
    const { classe, sequence } = req.params;
    const notes = await readCSV(`./data/exemple CSV - Sequence ${sequence} ${classe}.csv`);

    // Skip coefficient row
    const reportData = notes.slice(1);

    // Sort by average descending
    reportData.sort((a, b) => parseFloat(b.MOYENNE || 0) - parseFloat(a.MOYENNE || 0));

    // Add ranking
    reportData.forEach((row, index) => {
      row.RANG = `${index + 1}e`;
    });

    const report = {
      titre: `Carnet de Notes Séquentiel - Séquence ${sequence}`,
      classe: classe,
      anneeScolaire: '2024-2025',
      dateGeneration: new Date().toISOString(),
      donnees: reportData
    };

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Erreur génération rapport séquentiel: ' + error.message });
  }
};

exports.generateTermReport = async (req, res) => {
  try {
    const { classe, trimestre } = req.params;

    // Load all sequences for the term
    const sequences = [];
    for (let seq = 1; seq <= 3; seq++) {
      try {
        const notes = await readCSV(`./data/exemple CSV - Sequence ${seq} ${classe}.csv`);
        sequences.push(notes.slice(2)); // Skip header and coefficients
      } catch (error) {
        // Sequence might not exist, continue
        continue;
      }
    }

    if (sequences.length === 0) {
      return res.status(404).json({ error: 'Aucune séquence trouvée pour ce trimestre' });
    }

    // Calculate term averages
    const termResults = {};
    sequences.forEach((seqNotes, seqIndex) => {
      seqNotes.forEach(note => {
        const nom = note['Noms & prénoms Eleve 0'] || note.nom;
        if (!termResults[nom]) {
          termResults[nom] = {
            nom: nom,
            sequences: [],
            moyenneTrimestre: 0
          };
        }
        const moyenne = parseFloat(note.MOYENNE || 0);
        termResults[nom].sequences.push({
          sequence: seqIndex + 1,
          moyenne: moyenne
        });
      });
    });

    // Calculate term average
    Object.values(termResults).forEach(student => {
      const validMoyennes = student.sequences.map(s => s.moyenne).filter(m => !isNaN(m));
      student.moyenneTrimestre = validMoyennes.length > 0
        ? validMoyennes.reduce((sum, m) => sum + m, 0) / validMoyennes.length
        : 0;
    });

    // Sort by term average
    const sortedResults = Object.values(termResults).sort((a, b) => b.moyenneTrimestre - a.moyenneTrimestre);

    // Add ranking
    sortedResults.forEach((student, index) => {
      student.rangTrimestre = `${index + 1}e`;
    });

    const report = {
      titre: `Carnet de Notes Trimestriel - Trimestre ${trimestre}`,
      classe: classe,
      anneeScolaire: '2024-2025',
      dateGeneration: new Date().toISOString(),
      donnees: sortedResults
    };

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Erreur génération rapport trimestriel: ' + error.message });
  }
};

exports.generatePV = async (req, res) => {
  try {
    const { classe, annee } = req.params;

    // Load students
    const students = await readCSV('./data/exemple CSV - Liste eleves A1 ELEC.csv');

    // Load all sequences for the year
    const allSequences = [];
    for (let seq = 1; seq <= 6; seq++) {
      try {
        const notes = await readCSV(`./data/exemple CSV - Sequence ${seq} ${classe}.csv`);
        allSequences.push(notes.slice(2)); // Skip header and coefficients
      } catch (error) {
        continue;
      }
    }

    // Calculate annual results
    const annualResults = students.map(student => {
      const nom = student['NOM et PRENOMS'];
      const studentNotes = [];

      allSequences.forEach((seqNotes, seqIndex) => {
        const note = seqNotes.find(n => n['Noms & prénoms Eleve 0'] === nom);
        if (note) {
          studentNotes.push({
            sequence: seqIndex + 1,
            moyenne: parseFloat(note.MOYENNE || 0)
          });
        }
      });

      const validMoyennes = studentNotes.map(n => n.moyenne).filter(m => !isNaN(m));
      const moyenneAnnuelle = validMoyennes.length > 0
        ? validMoyennes.reduce((sum, m) => sum + m, 0) / validMoyennes.length
        : 0;

      return {
        ...student,
        notesSequences: studentNotes,
        moyenneAnnuelle: moyenneAnnuelle,
        decision: moyenneAnnuelle >= 10 ? 'Admis' : moyenneAnnuelle >= 8 ? 'Rattrapage' : 'Redouble'
      };
    });

    // Sort by annual average
    annualResults.sort((a, b) => b.moyenneAnnuelle - a.moyenneAnnuelle);

    // Add ranking
    annualResults.forEach((student, index) => {
      student.rangAnnuel = `${index + 1}e`;
    });

    const pv = {
      titre: `Procès-Verbal Annuel - ${annee}`,
      classe: classe,
      anneeScolaire: annee,
      dateGeneration: new Date().toISOString(),
      statistiques: {
        totalEleves: annualResults.length,
        admis: annualResults.filter(s => s.decision === 'Admis').length,
        rattrapage: annualResults.filter(s => s.decision === 'Rattrapage').length,
        redouble: annualResults.filter(s => s.decision === 'Redouble').length,
        moyenneClasse: annualResults.reduce((sum, s) => sum + s.moyenneAnnuelle, 0) / annualResults.length
      },
      eleves: annualResults
    };

    res.json(pv);
  } catch (error) {
    res.status(500).json({ error: 'Erreur génération PV: ' + error.message });
  }
};

exports.exportReport = async (req, res) => {
  try {
    const { type, classe, period } = req.params;
    let data;

    switch (type) {
      case 'sequential':
        data = await this.generateSequentialReport({ params: { classe, sequence: period } }, { json: (d) => data = d });
        break;
      case 'term':
        data = await this.generateTermReport({ params: { classe, trimestre: period } }, { json: (d) => data = d });
        break;
      case 'pv':
        data = await this.generatePV({ params: { classe, annee: period } }, { json: (d) => data = d });
        break;
      default:
        return res.status(400).json({ error: 'Type de rapport invalide' });
    }

    const fileName = `${type}_report_${classe}_${period}_${Date.now()}.csv`;
    const filePath = `./exports/${fileName}`;

    // Ensure exports directory exists
    if (!fs.existsSync('./exports')) {
      fs.mkdirSync('./exports');
    }

    await writeCSV(filePath, data.donnees || data.eleves || []);

    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Erreur téléchargement:', err);
      }
      // Clean up file after download
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};