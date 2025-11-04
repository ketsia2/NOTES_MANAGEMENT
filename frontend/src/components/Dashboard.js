import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      if (isAdmin()) {
        const response = await axios.get('http://localhost:3000/api/dashboard/global');
        setStats(response.data);
      } else {
        // For teachers, show their specific stats
        // This would need to be implemented based on teacher-specific endpoints
        setStats({
          message: 'Tableau de bord enseignant - Fonctionnalité à implémenter'
        });
      }
    } catch (error) {
      setError('Erreur lors du chargement des données');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard">
      <h1>Tableau de Bord</h1>

      {isAdmin() && stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Élèves</h3>
            <p className="stat-number">{stats.totalStudents}</p>
          </div>

          <div className="stat-card">
            <h3>Total Enseignants</h3>
            <p className="stat-number">{stats.totalTeachers}</p>
          </div>

          <div className="stat-card">
            <h3>Total Classes</h3>
            <p className="stat-number">{stats.totalClasses}</p>
          </div>

          <div className="stat-card">
            <h3>Moyenne Générale</h3>
            <p className="stat-number">{stats.overallAverage?.toFixed(2)}</p>
          </div>

          <div className="stat-card full-width">
            <h3>Répartition par Genre</h3>
            <div className="gender-stats">
              <div className="gender-stat">
                <span>Garçons: {stats.genderDistribution?.male}</span>
              </div>
              <div className="gender-stat">
                <span>Filles: {stats.genderDistribution?.female}</span>
              </div>
            </div>
          </div>

          <div className="stat-card full-width">
            <h3>Répartition par Ancienneté</h3>
            <div className="seniority-stats">
              <div className="seniority-stat">
                <span>Nouveaux: {stats.seniorityDistribution?.nouveau}</span>
              </div>
              <div className="seniority-stat">
                <span>Triples: {stats.seniorityDistribution?.triple}</span>
              </div>
            </div>
          </div>

          {stats.topPerformers && stats.topPerformers.length > 0 && (
            <div className="stat-card full-width">
              <h3>Meilleurs Élèves</h3>
              <div className="top-performers">
                {stats.topPerformers.map((student, index) => (
                  <div key={index} className="performer">
                    <span>{student.nom}</span>
                    <span>{student.moyenne?.toFixed(2)} ({student.rang})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!isAdmin() && (
        <div className="teacher-dashboard">
          <h2>Tableau de Bord Enseignant</h2>
          <p>Interface pour les enseignants à développer...</p>
          {/* Teacher-specific dashboard content would go here */}
        </div>
      )}
    </div>
  );
};

export default Dashboard;