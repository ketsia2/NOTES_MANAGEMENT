import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

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
        const response = await axios.get('http://localhost:3001/api/dashboard/global');
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
    <div className="min-h-screen bg-gray-50 p-6 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de Bord</h1>
          <p className="text-gray-600">Aperçu général du système éducatif</p>
        </div>

        {isAdmin() && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border p-6 animate-slide-in">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Élèves</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6 animate-slide-in" style={{animationDelay: '0.1s'}}>
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Enseignants</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalTeachers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6 animate-slide-in" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Classes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalClasses}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6 animate-slide-in" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Moyenne Générale</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.overallAverage?.toFixed(2) || '0.00'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {isAdmin() && stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border p-6 animate-slide-in" style={{animationDelay: '0.4s'}}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par Genre</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Garçons</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{width: `${(stats.genderDistribution?.male || 0) / (stats.totalStudents || 1) * 100}%`}}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{stats.genderDistribution?.male || 0}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Filles</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="bg-pink-500 h-2 rounded-full"
                        style={{width: `${(stats.genderDistribution?.female || 0) / (stats.totalStudents || 1) * 100}%`}}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{stats.genderDistribution?.female || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6 animate-slide-in" style={{animationDelay: '0.5s'}}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par Ancienneté</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Nouveaux</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{width: `${(stats.seniorityDistribution?.nouveau || 0) / (stats.totalStudents || 1) * 100}%`}}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{stats.seniorityDistribution?.nouveau || 0}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Triples</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full"
                        style={{width: `${(stats.seniorityDistribution?.triple || 0) / (stats.totalStudents || 1) * 100}%`}}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{stats.seniorityDistribution?.triple || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isAdmin() && stats && stats.topPerformers && stats.topPerformers.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-6 animate-slide-in" style={{animationDelay: '0.6s'}}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Meilleurs Élèves</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.topPerformers.slice(0, 6).map((student, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-bold text-yellow-600">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{student.nom || 'N/A'}</p>
                      <p className="text-xs text-gray-500">{student.rang || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{student.moyenne?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isAdmin() && (
          <div className="bg-white rounded-lg shadow-sm border p-6 animate-slide-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tableau de Bord Enseignant</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Mes Classes</h3>
                <p className="text-gray-600">Consultez vos classes assignées</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Saisir Notes</h3>
                <p className="text-gray-600">Entrez les notes de vos élèves</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Rapports</h3>
                <p className="text-gray-600">Consultez les bulletins</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;