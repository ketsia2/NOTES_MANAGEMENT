const User = require('../models/User');
const Teacher = require('../models/Teacher');
const jwt = require('jsonwebtoken');

// In-memory storage for demo (replace with database)
let users = [];
let teachers = [];

// Initialize with default admin user
const initializeDefaultUsers = async () => {
  const defaultAdmin = new User({
    id: 'admin1',
    username: 'admin',
    email: 'admin@school.com',
    password: 'admin123',
    role: 'admin'
  });
  await defaultAdmin.hashPassword();
  users.push(defaultAdmin);
};

initializeDefaultUsers();

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    'your-secret-key', // In production, use environment variable
    { expiresIn: '24h' }
  );
};

exports.register = async (req, res) => {
  try {
    const { username, email, password, role, teacherData } = req.body;

    // Only admin can register teachers
    if (role === 'teacher' && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Seul un administrateur peut créer un compte enseignant' });
    }

    // Validate teacher data for teacher registration
    if (role === 'teacher' && !teacherData) {
      return res.status(400).json({ error: 'Les données de l\'enseignant sont requises' });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.username === username || u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'Utilisateur déjà existant' });
    }

    const user = new User({ username, email, password, role });
    await user.hashPassword();

    // If registering a teacher, create teacher profile
    if (role === 'teacher' && teacherData) {
       const teacher = new Teacher({
         ...teacherData,
         id: user.id, // Link user to teacher
         matieres: teacherData.matieres || [], // Subjects the teacher teaches
         classes: teacherData.classes || [] // Classes the teacher teaches
       });
       teachers.push(teacher);
       user.teacherId = teacher.id;
     }

    users.push(user);

    const token = generateToken(user);
    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    console.log('LOGIN ROUTE CALLED:', req.body);
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);
    if (!user) {
      console.log('User not found:', username);
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const isValidPassword = await user.checkPassword(password);
    if (!isValidPassword) {
      console.log('Invalid password for user:', username);
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    user.updateLastLogin();
    const token = generateToken(user);

    // Get teacher data if user is a teacher
    let teacherData = null;
    if (user.isTeacher() && user.teacherId) {
      teacherData = teachers.find(t => t.id === user.teacherId);
    }

    console.log('Login successful for user:', username);
    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        teacher: teacherData
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    let teacherData = null;
    if (user.isTeacher() && user.teacherId) {
      teacherData = teachers.find(t => t.id === user.teacherId);
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        teacher: teacherData
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Middleware to verify JWT token
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token d\'authentification requis' });
  }

  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalide' });
    }
    req.user = user;
    next();
  });
};

// Middleware to check admin role
exports.requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Accès administrateur requis' });
  }
  next();
};

// Middleware to check teacher role
exports.requireTeacher = (req, res, next) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ error: 'Accès enseignant requis' });
  }
  next();
};