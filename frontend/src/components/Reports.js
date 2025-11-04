import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Reports.css';

const Reports = () => {
  const { isAdmin } = useAuth();
  const [reportType, setReportType] = useState('sequential');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    classe: 'A1 ELEC',
    sequence: '1',
    trimestre: '1',
    annee: '2024-2025'
  });

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const generateReport = async () => {
    try {
      setLoading(true);
      setError('');
      let endpoint = '';

      switch (reportType) {
        case 'sequential':
          endpoint = `/api/reports/sequential/${filters.classe}/${filters.sequence}`;
          break;
        case 'term':
          endpoint = `/api/reports/term/${filters.classe}/${filters.trimestre}`;
          break;
        case 'pv':
          endpoint = `/api/reports/pv/${filters.classe}/${filters.annee}`;
          break;
        default:
          throw new Error('Type de rapport invalide');
      }

      const response = await axios.get(`http://localhost:3000${endpoint}`);
      setReportData(response.data);
    } catch (error) {
      setError('Erreur lors de la génération du rapport');
      console.error('Report generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async () => {
    try {
      setLoading(true);
      let period = '';

      switch (reportType) {
        case 'sequential':
          period = filters.sequence;
          break;
        case 'term':
          period = filters.trimestre;
          break;
        case 'pv':
          period = filters.annee;
          break;
      }

      const response = await axios.get(
        `http://localhost:3000/api/reports/export/${reportType}/${filters.classe}/${period}`,
        { responseType: 'blob' }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType}_report_${filters.classe}_${period}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError('Erreur lors de l\'export du rapport');
      console.error('Report export error:', error);
    } finally {
      setLoading(false);
    }
  };

  const printReport = () => {
    window.print();
  };

  if (!isAdmin()) {
    return <div className="error">Accès non autorisé</div>;
  }

  return (
    <div className="reports">
      <h1>Rapports et Bulletins</h1>

      {error && <div className="error">{error}</div>}

      <div className="report-controls">
        <div className="control-group">
          <label>Type de rapport:</label>
          <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <option value="sequential">Carnet Séquentiel</option>
            <option value="term">Carnet Trimestriel</option>
            <option value="pv">Procès-Verbal (PV)</option>
          </select>
        </div>

        <div className="control-group">
          <label>Classe:</label>
          <select name="classe" value={filters.classe} onChange={handleFilterChange}>
            <option value="A1 ELEC">A1 ELEC</option>
          </select>
        </div>

        {reportType === 'sequential' && (
          <div className="control-group">
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
        )}

        {reportType === 'term' && (
          <div className="control-group">
            <label>Trimestre:</label>
            <select name="trimestre" value={filters.trimestre} onChange={handleFilterChange}>
              <option value="1">Trimestre 1</option>
              <option value="2">Trimestre 2</option>
              <option value="3">Trimestre 3</option>
            </select>
          </div>
        )}

        {reportType === 'pv' && (
          <div className="control-group">
            <label>Année scolaire:</label>
            <select name="annee" value={filters.annee} onChange={handleFilterChange}>
              <option value="2024-2025">2024-2025</option>
              <option value="2025-2026">2025-2026</option>
            </select>
          </div>
        )}

        <div className="action-buttons">
          <button onClick={generateReport} disabled={loading} className="generate-btn">
            {loading ? 'Génération...' : 'Générer le Rapport'}
          </button>
          {reportData && (
            <>
              <button onClick={exportReport} className="export-btn">
                Exporter CSV
              </button>
              <button onClick={printReport} className="print-btn">
                Imprimer
              </button>
            </>
          )}
        </div>
      </div>

      {reportData && (
        <div className="report-display">
          <div className="report-header">
            <h2>{reportData.titre}</h2>
            <div className="report-info">
              <p><strong>Classe:</strong> {reportData.classe}</p>
              <p><strong>Année scolaire:</strong> {reportData.anneeScolaire}</p>
              <p><strong>Date de génération:</strong> {new Date(reportData.dateGeneration).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>

          {reportData.statistiques && (
            <div className="report-stats">
              <h3>Statistiques</h3>
              <div className="stats-grid">
                {Object.entries(reportData.statistiques).map(([key, value]) => (
                  <div key={key} className="stat-item">
                    <span className="stat-label">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
                    <span className="stat-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="report-table">
            <table>
              <thead>
                <tr>
                  {reportData.donnees && reportData.donnees.length > 0 && Object.keys(reportData.donnees[0]).map(key => (
                    <th key={key}>{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</th>
                  ))}
                  {reportData.eleves && reportData.eleves.length > 0 && Object.keys(reportData.eleves[0]).map(key => (
                    <th key={key}>{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(reportData.donnees || reportData.eleves || []).map((item, index) => (
                  <tr key={index}>
                    {Object.values(item).map((value, i) => (
                      <td key={i}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;