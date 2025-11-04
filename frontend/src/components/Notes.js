import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Notes.css';

const Notes = () => {
  const { user, isAdmin, isTeacher } = useAuth();
  const [teacherClasses, setTeacherClasses] = useState([]);
  const [teacherSubjects, setTeacherSubjects] = useState([]);
  const [notes, setNotes] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [filters, setFilters] = useState({
    classe: 'A1 ELEC',
    sequence: '1',
    matiere: ''
  });

  const [formData, setFormData] = useState({
    nom: '',
    matiereId: '',
    note: '',
    coefficient: 1,
    classe: 'A1 ELEC',
    sequence: 1
  });

  useEffect(() => {
    fetchData();
    if (isTeacher() && user?.teacher) {
      fetchTeacherData();
    }
  }, [user]);

  useEffect(() => {
    if (filters.classe && filters.sequence) {
      fetchNotes();
    }
  }, [filters]);

  const fetchTeacherData = async () => {
    try {
      const [classesRes, subjectsRes] = await Promise.all([
        axios.get(`http://localhost:3000/api/teacher-notes/${user.teacher.id}/classes`),
        axios.get(`http://localhost:3000/api/teacher-notes/${user.teacher.id}/subjects`)
      ]);
      setTeacherClasses(classesRes.data);
      setTeacherSubjects(subjectsRes.data);
    } catch (error) {
      console.error('Teacher data fetch error:', error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsRes, subjectsRes] = await Promise.all([
        axios.get('http://localhost:3000/api/students'),
        axios.get('http://localhost:3000/api/subjects')
      ]);
      setStudents(studentsRes.data);
      setSubjects(subjectsRes.data);
    } catch (error) {
      setError('Erreur lors du chargement des données');
      console.error('Data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/notes', {
        params: filters
      });
      setNotes(response.data);
    } catch (error) {
      setError('Erreur lors du chargement des notes');
      console.error('Notes fetch error:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const noteData = {
        ...formData,
        enseignantId: user.teacher?.id,
        coefficient: parseFloat(formData.coefficient)
      };

      if (editingNote) {
        await axios.put(`http://localhost:3000/api/notes/${editingNote.nom}/${editingNote.sequence}`, noteData);
      } else {
        await axios.post('http://localhost:3000/api/notes', noteData);
      }
      fetchNotes();
      setShowForm(false);
      setEditingNote(null);
      resetForm();
    } catch (error) {
      setError('Erreur lors de la sauvegarde');
      console.error('Note save error:', error);
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setFormData({
      nom: note.nom,
      matiereId: note.matiereId || '',
      note: note.note || '',
      coefficient: note.coefficient || 1,
      classe: note.classe,
      sequence: note.sequence
    });
    setShowForm(true);
  };

  const handleDelete = async (nom, sequence) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      try {
        await axios.delete(`http://localhost:3000/api/notes/${nom}/${sequence}`);
        fetchNotes();
      } catch (error) {
        setError('Erreur lors de la suppression');
        console.error('Note delete error:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      matiereId: '',
      note: '',
      coefficient: 1,
      classe: 'A1 ELEC',
      sequence: 1
    });
  };

  const getSubjectName = (subjectId) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.nom : subjectId;
  };

  if (loading) {
    return <div className="loading">Chargement des notes...</div>;
  }

  return (
    <div className="notes">
      <div className="header">
        <h1>Gestion des Notes</h1>
        {(isAdmin() || isTeacher()) && (
          <button onClick={() => setShowForm(true)} className="add-btn">
            Ajouter une Note
          </button>
        )}
      </div>

      {error && <div className="error">{error}</div>}

      {/* Filters */}
      <div className="filters">
        <div className="filter-controls">
          <div className="form-group">
            <label>Classe:</label>
            <select name="classe" value={filters.classe} onChange={handleFilterChange}>
              {isTeacher() && teacherClasses.length > 0 ? (
                teacherClasses.map(classe => (
                  <option key={classe} value={classe}>{classe}</option>
                ))
              ) : (
                <option value="A1 ELEC">A1 ELEC</option>
              )}
            </select>
          </div>

          <div className="form-group">
            <label>Séquence:</label>
            <select name="sequence" value={filters.sequence} onChange={handleFilterChange}>
              <option value="1">Séquence 1</option>
              <option value="2">Séquence 2</option>
              <option value="3">Séquence 3</option>
              <option value="4">Séquence 4</option>
              <option value="5">Séquence 5</option>
              <option value="6">Séquence 6</option>
            </select>
          </div>

          <div className="form-group">
            <label>Matière:</label>
            <select name="matiere" value={filters.matiere} onChange={handleFilterChange}>
              <option value="">Toutes les matières</option>
              {(isTeacher() && teacherSubjects.length > 0 ? teacherSubjects : subjects).map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.nom}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Notes List */}
      <div className="notes-list">
        <table>
          <thead>
            <tr>
              <th>Élève</th>
              <th>Matière</th>
              <th>Note</th>
              <th>Coefficient</th>
              <th>Classe</th>
              <th>Séquence</th>
              {(isAdmin() || isTeacher()) && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {notes.map((note, index) => (
              <tr key={`${note.nom}-${note.sequence}-${index}`}>
                <td>{note.nom}</td>
                <td>{getSubjectName(note.matiereId)}</td>
                <td>{note.note || note.moyenne}</td>
                <td>{note.coefficient}</td>
                <td>{note.classe}</td>
                <td>{note.sequence}</td>
                {(isAdmin() || isTeacher()) && (
                  <td>
                    <button onClick={() => handleEdit(note)} className="edit-btn">
                      Modifier
                    </button>
                    <button onClick={() => handleDelete(note.nom, note.sequence)} className="delete-btn">
                      Supprimer
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editingNote ? 'Modifier la Note' : 'Ajouter une Note'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Élève:</label>
                  <select
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Sélectionner un élève</option>
                    {students.map((student) => (
                      <option key={student.matricule} value={student.nom}>
                        {student.nom} ({student.matricule})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Matière:</label>
                  <select
                    name="matiereId"
                    value={formData.matiereId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Sélectionner une matière</option>
                    {(isTeacher() && teacherSubjects.length > 0 ? teacherSubjects : subjects).map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.nom}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Note:</label>
                  <input
                    type="number"
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    min="0"
                    max="20"
                    step="0.5"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Coefficient:</label>
                  <input
                    type="number"
                    name="coefficient"
                    value={formData.coefficient}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Classe:</label>
                  <select
                    name="classe"
                    value={formData.classe}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="A1 ELEC">A1 ELEC</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Séquence:</label>
                  <select
                    name="sequence"
                    value={formData.sequence}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="1">Séquence 1</option>
                    <option value="2">Séquence 2</option>
                    <option value="3">Séquence 3</option>
                    <option value="4">Séquence 4</option>
                    <option value="5">Séquence 5</option>
                    <option value="6">Séquence 6</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit">
                  {editingNote ? 'Modifier' : 'Ajouter'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditingNote(null); resetForm(); }}>
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

export default Notes;