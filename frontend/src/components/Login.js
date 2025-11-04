import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'teacher' // Default role
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      if (isRegistering) {
        result = await register(formData);
      } else {
        result = await login(formData.username, formData.password);
      }

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isRegistering ? 'Inscription' : 'Connexion'}</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Rôle:</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="teacher">Enseignant</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label>Nom d'utilisateur:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Mot de passe:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Chargement...' : (isRegistering ? 'S\'inscrire' : 'Se connecter')}
          </button>
        </form>

        <p className="toggle-form">
          {isRegistering ? 'Déjà un compte ?' : 'Pas de compte ?'}
          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="link-button"
          >
            {isRegistering ? 'Se connecter' : 'S\'inscrire'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;