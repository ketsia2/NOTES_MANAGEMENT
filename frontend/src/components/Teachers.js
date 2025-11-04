import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Teachers.css';

const Teachers = () => {
  const { isAdmin } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);

  const [formData, setFormData] = useState({
    nom: '',
    prenoms: '',
    email: '',
    telephone: '',
    matieres: [],
    classes: []
  });

  useEffect(() => {
    if (isAdmin()) {
      fetchTeachers();
      fetchSubjects();
    }
  }, [isAdmin]);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/teachers');
      setTeachers(response.data);
    } catch (error) {
      setError('Erreur lors du chargement des enseignants');
      console.error('Teachers fetch error:', error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/subjects');
      setSubjects(response.data);
    } catch (error) {
      console.error('Subjects fetch error:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleArrayChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: Array.isArray(value) ? value : [value]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTeacher) {
        await axios.put(`http://localhost:3000/api/teachers/${editingTeacher.id}`, formData);
      } else {
        await axios.post('http://localhost:3000/api/teachers', formData);
      }
      fetchTeachers();
      setShowForm(false);
      setEditingTeacher(null);
      resetForm();
    } catch (error) {
      setError('Erreur lors de la sauvegarde');
      console.error('Teacher save error:', error);
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      nom: teacher.nom,
      prenoms: teacher.prenoms,
      email: teacher.email,
      telephone: teacher.telephone,
      matieres: teacher.matieres || [],
      classes: teacher.classes || []
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet enseignant ?')) {
      try {
        await axios.delete(`http://localhost:3000/api/teachers/${id}`);
        fetchTeachers();
      } catch (error) {
        setError('Erreur lors de la suppression');
        console.error('Teacher delete error:', error);
      }
    }
  };

  const assignSubject = async (teacherId, subjectId) => {
    try {
      await axios.post(`http://localhost:3000/api/teachers/${teacherId}/subjects/${subjectId}`);
      fetchTeachers();
    } catch (error) {
      setError('Erreur lors de l\'assignation de la matière');
      console.error('Subject assignment error:', error);
    }
  };

  const assignClass = async (teacherId, className) => {
    try {
      await axios.post(`http://localhost:3000/api/teachers/${teacherId}/classes/${className}`);
      fetchTeachers();
    } catch (error) {
      setError('Erreur lors de l\'assignation de la classe');
      console.error('Class assignment error:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      prenoms: '',
      email: '',
      telephone: '',
      matieres: [],
      classes: []
    });
  };

  if (!isAdmin()) {
    return <div className="error">Accès non autorisé</div>;
  }

  if (loading) {
    return <div className="loading">Chargement des enseignants...</div>;
  }

  return (
    <div className="teachers">
      <div className="header">
        <h1>Gestion des Enseignants</h1>
        <button onClick={() => setShowForm(true)} className="add-btn">
          Ajouter un Enseignant
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {/* Teachers List */}
      <div className="teachers-list">
        {teachers.map((teacher) => (
          <div key={teacher.id} className="teacher-card">
            <div className="teacher-info">
              <h3>{teacher.nom} {teacher.prenoms}</h3>
              <p><strong>Email:</strong> {teacher.email}</p>
              <p><strong>Téléphone:</strong> {teacher.telephone}</p>
              <p><strong>Matières:</strong> {teacher.matieres?.length || 0}</p>
              <p><strong>Classes:</strong> {teacher.classes?.join(', ') || 'Aucune'}</p>
            </div>

            <div className="teacher-actions">
              <button onClick={() => handleEdit(teacher)} className="edit-btn">
                Modifier
              </button>
              <button onClick={() => handleDelete(teacher.id)} className="delete-btn">
                Supprimer
              </button>
            </div>

            {/* Quick Assignment */}
            <div className="quick-assign">
              <select onChange={(e) => e.target.value && assignSubject(teacher.id, e.target.value)}>
                <option value="">Assigner une matière</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.nom}
                  </option>
                ))}
              </select>

              <select onChange={(e) => e.target.value && assignClass(teacher.id, e.target.value)}>
                <option value="">Assigner une classe</option>
                <option value="A1 ELEC">A1 ELEC</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editingTeacher ? 'Modifier l\'Enseignant' : 'Ajouter un Enseignant'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Nom:</label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Prénoms:</label>
                  <input
                    type="text"
                    name="prenoms"
                    value={formData.prenoms}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Téléphone:</label>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Matières (séparées par des virgules):</label>
                <input
                  type="text"
                  name="matieres"
                  value={formData.matieres.join(', ')}
                  onChange={(e) => handleArrayChange('matieres', e.target.value.split(',').map(s => s.trim()))}
                  placeholder="Ex: Mathématiques, Français"
                />
              </div>

              <div className="form-group">
                <label>Classes (séparées par des virgules):</label>
                <input
                  type="text"
                  name="classes"
                  value={formData.classes.join(', ')}
                  onChange={(e) => handleArrayChange('classes', e.target.value.split(',').map(s => s.trim()))}
                  placeholder="Ex: A1 ELEC, A2 ELEC"
                />
              </div>

              <div className="form-actions">
                <button type="submit">
                  {editingTeacher ? 'Modifier' : 'Ajouter'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditingTeacher(null); resetForm(); }}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teachers;