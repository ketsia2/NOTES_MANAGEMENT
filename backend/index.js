const express = require('express');
const cors = require('cors');
const multer = require('multer');
const readCSV = require('./utils/csvReader');
const writeCSV = require('./utils/csvWriter');
const fs = require('fs');
const csv = require('csv-parser');

// Import routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const teacherRoutes = require('./routes/teachers');
const subjectRoutes = require('./routes/subjects');
const noteRoutes = require('./routes/notes');
const searchRoutes = require('./routes/search');
const reportRoutes = require('./routes/reports');
const dashboardRoutes = require('./routes/dashboard');
const teacherNoteRoutes = require('./routes/teacherNotes');

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/teacher-notes', teacherNoteRoutes);

// Legacy routes for backward compatibility
app.post('/upload-eleves', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier fourni' });
  }

  const results = [];
  const filePath = req.file.path;

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      fs.unlinkSync(filePath); // Supprime le fichier uploadé après lecture
      res.json({ success: true, data: results });
    })
    .on('error', (error) => {
      fs.unlinkSync(filePath); // Supprime le fichier en cas d'erreur
      res.status(500).json({ success: false, message: error.message });
    });
});

app.post('/export-eleves', (req, res) => {
  const fakeData = [
    { nom: 'Eleve Test 1', sexe: 'F', matricule: '0001' },
    { nom: 'Eleve Test 2', sexe: 'M', matricule: '0002' }
  ];

  try {
    writeCSV('./data/export-eleves.csv', fakeData);
    res.json({ message: 'Fichier exporté avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur exportation' });
  }
});

app.get('/eleves', async (req, res) => {
  try {
    const data = await readCSV('./data/exemple CSV - Liste eleves A1 ELEC.csv');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lecture élèves' });
  }
});

app.get('/notes', async (req, res) => {
  try {
    const data = await readCSV('./data/exemple CSV - Sequence 1 A1 ELEC.csv');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lecture notes' });
  }
});

app.post('/upload-notes', upload.single('notesFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier fourni' });
  }
  res.json({ message: 'Fichier notes uploadé avec succès', filename: req.file.filename });
});

app.listen(3000, () => console.log('Backend running on http://localhost:3000'));
