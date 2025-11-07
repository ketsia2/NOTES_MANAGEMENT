import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Verify token and get user profile
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/auth/profile');
      console.log('Profile response:', response.data);
      setUser(response.data.user);
    } catch (error) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      console.log('Attempting login with:', { username, password });
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        username,
        password
      });
      console.log('Login response:', response.data);

      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      return { success: false, error: error.response?.data?.error || 'Erreur de connexion' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('http://localhost:3001/api/auth/register', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Erreur d\'inscription' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const isAdmin = () => user?.role === 'admin';
  const isTeacher = () => user?.role === 'teacher';

  const value = {
    user,
    login,
    register,
    logout,
    isAdmin,
    isTeacher,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};