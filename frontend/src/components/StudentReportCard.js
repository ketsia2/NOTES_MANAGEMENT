import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './StudentReportCard.css';

const StudentReportCard = ({ studentId, onClose }) => {
  const { isAdmin } = useAuth();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reportType, setReportType] = useState('sequential'); // sequential, term, annual

  useEffect(() => {
    if (studentId) {
      generateReport();
    }
  }, [studentId, reportType]);

  const generateReport = async () => {
    try {
      setLoading(true);
      setError('');

      let endpoint = '';
      let params = { studentId };

      switch (reportType) {
        case 'sequential':
          // For individual student sequential report, we'd need to implement this
          // For now, show a message
          setReportData({
            type: 'sequential',
            message: 'Rapport séquentiel individuel à implémenter',
            student: { nom: 'Élève Test', matricule: studentId }
          });
          break;
        case 'term':
          // For individual student term report
          setReportData({
            type: 'term',
            message: 'Rapport trimestriel individuel à implémenter',
            student: { nom: 'Élève Test', matricule: studentId }
          });
          break;
        case 'annual':
          // For individual student annual report
          endpoint = `/api/reports/pv/A1 ELEC/2024-2025`;
          const response = await axios.get(`http://localhost:3000${endpoint}`);
          // Find the specific student in the PV data
          const studentData = response.data.eleves?.find(eleve =>
            eleve.matricule === studentId || eleve.id === studentId
          );
          if (studentData) {
            setReportData({
              type: 'annual',
              ...response.data,
              student: studentData,
              individual: true
            });
          } else {
            setError('Élève non trouvé dans les données annuelles');
          }
          break;
        default:
          setError('Type de rapport invalide');
      }
    } catch (error) {
      setError('Erreur lors de la génération du rapport');
      console.error('Report generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatRank = (rank) => {
    if (rank === 1) return '1er';
    if (rank === 2) return '2ème';
    if (rank === 3) return '3ème';
    return `${rank}ème`;
  };

  const getDecisionColor = (decision) => {
    if (decision?.includes('ADMIS')) return 'text-green-600';
    if (decision?.includes('RATTRAPAGE')) return 'text-orange-600';
    return 'text-red-600';
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = async () => {
    try {
      // Export individual student report as PDF would require additional implementation
      alert('Export PDF à implémenter');
    } catch (error) {
      setError('Erreur lors de l\'export');
    }
  };

  if (!isAdmin()) {
    return <div className="error">Accès non autorisé</div>;
  }

  if (loading) {
    return <div className="loading">Génération du bulletin...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="student-report-card">
      <div className="report-header">
        <div className="logo-section">
          <div className="logo-placeholder">NC</div>
          <div className="school-info">
            <h1>Noka College</h1>
            <p>BP: 12345 | Tel: +237 123 456 789</p>
          </div>
        </div>

        <div className="report-controls">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="report-type-select"
          >
            <option value="sequential">Bulletin Séquentiel</option>
            <option value="term">Bulletin Trimestriel</option>
            <option value="annual">Bulletin Annuel</option>
          </select>

          <div className="action-buttons">
            <button onClick={handlePrint} className="print-btn">
              🖨️ Imprimer
            </button>
            <button onClick={handleExport} className="export-btn">
              📄 Exporter PDF
            </button>
            <button onClick={onClose} className="close-btn">
              ✕ Fermer
            </button>
          </div>
        </div>
      </div>

      {reportData && (
        <div className="report-content">
          {reportData.type === 'annual' && reportData.individual && (
            <div className="annual-report">
              <div className="report-title">
                <h2>BULLETIN ANNUEL INDIVIDUEL</h2>
                <p>Année Scolaire: {reportData.anneeScolaire}</p>
              </div>

              <div className="student-info">
                <div className="info-grid">
                  <div><strong>Nom & Prénoms:</strong> {reportData.student.nom}</div>
                  <div><strong>Matricule:</strong> {reportData.student.matricule || reportData.student.id}</div>
                  <div><strong>Classe:</strong> {reportData.student.classe}</div>
                  <div><strong>Moyenne Annuelle:</strong> {reportData.student.moyenneAnnuelle?.toFixed(2)}/20</div>
                </div>
              </div>

              <div className="annual-results">
                <h3>RÉSULTATS ANNUELS</h3>
                <div className="decision-section">
                  <div className="decision-box">
                    <h4>DÉCISION FINALE</h4>
                    <div className={`decision-text ${getDecisionColor(reportData.student.decision)}`}>
                      {reportData.student.decision}
                    </div>
                  </div>
                </div>

                <div className="trimester-details">
                  <h4>DÉTAIL PAR TRIMESTRE</h4>
                  <div className="trimester-grid">
                    {reportData.student.notesSequences?.map((note, index) => (
                      <div key={index} className="trimester-card">
                        <h5>{index + 1}ème Trimestre</h5>
                        <p>Moyenne: {note.moyenne?.toFixed(2)}/20</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="signatures">
                <div className="signature-line">
                  <p>Le Titulaire de la Classe</p>
                  <div className="signature-box"></div>
                </div>
                <div className="signature-line">
                  <p>Le Chef d'Établissement</p>
                  <div className="signature-box"></div>
                </div>
              </div>
            </div>
          )}

          {(reportData.type === 'sequential' || reportData.type === 'term') && (
            <div className="placeholder-report">
              <h3>Bulletin {reportData.type === 'sequential' ? 'Séquentiel' : 'Trimestriel'} Individuel</h3>
              <p>Pour l'élève: {reportData.student?.nom}</p>
              <p className="placeholder-text">
                Cette fonctionnalité nécessite l'implémentation des rapports individuels détaillés
                basés sur les modèles fournis (bulletin-eleve.tsx et bulletin-trimestre-individuel.tsx).
              </p>
              <div className="implementation-note">
                <strong>Note:</strong> L'implémentation complète nécessiterait:
                <ul>
                  <li>Récupération des notes détaillées par séquence/matière</li>
                  <li>Calcul des moyennes par matière</li>
                  <li>Génération du format PDF avec mise en page professionnelle</li>
                  <li>Intégration des appréciations enseignants</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentReportCard;