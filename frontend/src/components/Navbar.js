import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin, isTeacher } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null; // Don't show navbar if not logged in
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Logo className="h-8 w-8 mr-2" />
        <h2>Noka College</h2>
      </div>

      <div className="navbar-menu">
        <Link to="/dashboard" className="navbar-link">Tableau de Bord</Link>

        {(isAdmin() || isTeacher()) && (
          <Link to="/students" className="navbar-link">Élèves</Link>
        )}

        {isAdmin() && (
          <Link to="/teachers" className="navbar-link">Enseignants</Link>
        )}

        {(isAdmin() || isTeacher()) && (
          <Link to="/notes" className="navbar-link">Notes</Link>
        )}

        {isAdmin() && (
          <Link to="/reports" className="navbar-link">Rapports</Link>
        )}
      </div>

      <div className="navbar-user">
        <span className="user-info">
          {user.username} ({user.role === 'admin' ? 'Admin' : 'Enseignant'})
        </span>
        <button onClick={handleLogout} className="logout-btn">
          Déconnexion
        </button>
      </div>
    </nav>
  );
};

export default Navbar;