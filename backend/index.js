require('dotenv').config();
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
app.use(cors({ origin: ['http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'http://localhost:3004'], credentials: true }));
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

// API Routes
console.log('Mounting routes...');
console.log('authRoutes type:', typeof authRoutes);
app.use('/api/auth', authRoutes);
console.log('Mounted /api/auth');
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/teacher-notes', teacherNoteRoutes);
console.log('All routes mounted');

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

// Add a simple test route to verify server is working
app.get('/test', (req, res) => {
  res.json({ message: 'Backend is running correctly' });
});

// Remove duplicate login route that conflicts with auth routes

// Add a catch-all route to debug routing
app.use((req, res) => {
  console.log('Unhandled request:', req.method, req.url);
  res.status(404).json({ error: 'Route not found', method: req.method, url: req.url });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));

module.exports = app;
