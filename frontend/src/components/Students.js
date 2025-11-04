import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import StudentReportCard from './StudentReportCard';
import './Students.css';

const Students = () => {
  const { isAdmin, isTeacher } = useAuth();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    sexe: '',
    anciennete: '',
    classe: '',
    nom: '',
    matricule: '',
    dateNaissance: '',
    residence: ''
  });

  const [formData, setFormData] = useState({
    nom: '',
    sexe: '',
    matricule: '',
    anciennete: '',
    dateNaissance: '',
    residence: '',
    classe: 'A1 ELEC'
  });
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [showReportCard, setShowReportCard] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [students, searchTerm, filters]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/students');
      setStudents(response.data);
    } catch (error) {
      setError('Erreur lors du chargement des élèves');
      console.error('Students fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = students;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.matricule.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Advanced filters
    if (filters.nom) {
      filtered = filtered.filter(student =>
        student.nom.toLowerCase().includes(filters.nom.toLowerCase())
      );
    }
    if (filters.matricule) {
      filtered = filtered.filter(student =>
        student.matricule.toLowerCase().includes(filters.matricule.toLowerCase())
      );
    }
    if (filters.sexe) {
      filtered = filtered.filter(student => student.sexe === filters.sexe);
    }
    if (filters.anciennete) {
      filtered = filtered.filter(student => student.anciennete === filters.anciennete);
    }
    if (filters.classe) {
      filtered = filtered.filter(student => student.classe === filters.classe);
    }
    if (filters.dateNaissance) {
      filtered = filtered.filter(student =>
        student.dateNaissance && student.dateNaissance.includes(filters.dateNaissance)
      );
    }
    if (filters.residence) {
      filtered = filtered.filter(student =>
        student.residence && student.residence.toLowerCase().includes(filters.residence.toLowerCase())
      );
    }

    setFilteredStudents(filtered);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await axios.put(`http://localhost:3000/api/students/${editingStudent.matricule}`, formData);
      } else {
        await axios.post('http://localhost:3000/api/students', formData);
      }
      fetchStudents();
      setShowForm(false);
      setEditingStudent(null);
      resetForm();
    } catch (error) {
      setError('Erreur lors de la sauvegarde');
      console.error('Student save error:', error);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData(student);
    setShowForm(true);
  };

  const handleDelete = async (matricule) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élève ?')) {
      try {
        await axios.delete(`http://localhost:3000/api/students/${matricule}`);
        fetchStudents();
      } catch (error) {
        setError('Erreur lors de la suppression');
        console.error('Student delete error:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      sexe: '',
      matricule: '',
      anciennete: '',
      dateNaissance: '',
      residence: '',
      classe: 'A1 ELEC'
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      sexe: '',
      anciennete: '',
      classe: ''
    });
  };

  if (loading) {
    return <div className="loading">Chargement des élèves...</div>;
  }

  return (
    <div className="students">
      <div className="header">
        <h1>Gestion des Élèves</h1>
        {isAdmin() && !isTeacher() && (
          <button onClick={() => setShowForm(true)} className="add-btn">
            Ajouter un Élève
          </button>
        )}
      </div>

      {error && <div className="error">{error}</div>}

      {/* Filters */}
      <div className="filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Rechercher par nom ou matricule..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <label>Nom:</label>
            <input
              type="text"
              name="nom"
              value={filters.nom}
              onChange={handleFilterChange}
              placeholder="Filtrer par nom"
            />
          </div>

          <div className="filter-group">
            <label>Matricule:</label>
            <input
              type="text"
              name="matricule"
              value={filters.matricule}
              onChange={handleFilterChange}
              placeholder="Filtrer par matricule"
            />
          </div>

          <div className="filter-group">
            <label>Genre:</label>
            <select name="sexe" value={filters.sexe} onChange={handleFilterChange}>
              <option value="">Tous</option>
              <option value="M">Garçons</option>
              <option value="F">Filles</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Ancienneté:</label>
            <select name="anciennete" value={filters.anciennete} onChange={handleFilterChange}>
              <option value="">Toutes</option>
              <option value="Nouveau">Nouveau</option>
              <option value="Triple">Triple</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Classe:</label>
            <select name="classe" value={filters.classe} onChange={handleFilterChange}>
              <option value="">Toutes</option>
              <option value="A1 ELEC">A1 ELEC</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Date naissance:</label>
            <input
              type="text"
              name="dateNaissance"
              value={filters.dateNaissance}
              onChange={handleFilterChange}
              placeholder="Ex: 2007"
            />
          </div>

          <div className="filter-group">
            <label>Résidence:</label>
            <input
              type="text"
              name="residence"
              value={filters.residence}
              onChange={handleFilterChange}
              placeholder="Filtrer par résidence"
            />
          </div>

          <button onClick={clearFilters} className="clear-filters-btn">
            Effacer les filtres
          </button>
        </div>
      </div>

      {/* Students List */}
      <div className="students-list">
        <table>
          <thead>
            <tr>
              <th>Matricule</th>
              <th>Nom & Prénoms</th>
              <th>Genre</th>
              <th>Ancienneté</th>
              <th>Classe</th>
              {isAdmin() && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.matricule}>
                <td>{student.matricule}</td>
                <td>{student.nom}</td>
                <td>{student.sexe === 'M' ? 'Garçon' : 'Fille'}</td>
                <td>{student.anciennete}</td>
                <td>{student.classe}</td>
                {isAdmin() && (
                  <td>
                    <button onClick={() => { setSelectedStudentId(student.matricule); setShowReportCard(true); }} className="report-btn">
                      📄 Bulletin
                    </button>
                    <button onClick={() => handleEdit(student)} className="edit-btn">
                      Modifier
                    </button>
                    <button onClick={() => handleDelete(student.matricule)} className="delete-btn">
                      Supprimer
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Student Report Card Modal */}
      {showReportCard && selectedStudentId && (
        <div className="modal-overlay">
          <StudentReportCard
            studentId={selectedStudentId}
            onClose={() => { setShowReportCard(false); setSelectedStudentId(null); }}
          />
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editingStudent ? 'Modifier l\'Élève' : 'Ajouter un Élève'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Nom & Prénoms:</label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Matricule:</label>
                  <input
                    type="text"
                    name="matricule"
                    value={formData.matricule}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Genre:</label>
                  <select
                    name="sexe"
                    value={formData.sexe}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Sélectionner</option>
                    <option value="M">Garçon</option>
                    <option value="F">Fille</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Ancienneté:</label>
                  <select
                    name="anciennete"
                    value={formData.anciennete}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Sélectionner</option>
                    <option value="Nouveau">Nouveau</option>
                    <option value="Triple">Triple</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date de Naissance:</label>
                  <input
                    type="text"
                    name="dateNaissance"
                    value={formData.dateNaissance}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Résidence:</label>
                  <input
                    type="text"
                    name="residence"
                    value={formData.residence}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

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

              <div className="form-actions">
                <button type="submit">
                  {editingStudent ? 'Modifier' : 'Ajouter'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditingStudent(null); resetForm(); }}>
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

export default Students;