import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import './Sidebar.css';

const Sidebar = () => {
  const { user, isAdmin, isTeacher } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!user) {
    return null;
  }

  const menuItems = [
    {
      path: '/dashboard',
      label: 'Tableau de Bord',
      icon: '📊',
      show: true
    },
    {
      path: '/students',
      label: 'Élèves',
      icon: '👨‍🎓',
      show: isAdmin() || isTeacher()
    },
    {
      path: '/teachers',
      label: 'Enseignants',
      icon: '👨‍🏫',
      show: isAdmin()
    },
    {
      path: '/notes',
      label: 'Notes',
      icon: '📝',
      show: isAdmin() || isTeacher()
    },
    {
      path: '/reports',
      label: 'Rapports',
      icon: '📄',
      show: isAdmin()
    }
  ];

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-section">
          <Logo className="sidebar-logo" />
          {!isCollapsed && (
            <div className="school-info">
              <h3>Noka College</h3>
              <p>Système de Gestion</p>
            </div>
          )}
        </div>
        <button
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {menuItems
            .filter(item => item.show)
            .map(item => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  title={isCollapsed ? item.label : ''}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!isCollapsed && <span className="nav-label">{item.label}</span>}
                </Link>
              </li>
            ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            {user.username.charAt(0).toUpperCase()}
          </div>
          {!isCollapsed && (
            <div className="user-details">
              <p className="user-name">{user.username}</p>
              <p className="user-role">
                {user.role === 'admin' ? 'Administrateur' : 'Enseignant'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;