import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Students from './components/Students';
import Teachers from './components/Teachers';
import Notes from './components/Notes';
import Reports from './components/Reports';
import Sidebar from './components/Sidebar';

// Context
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/students" element={<Students />} />
              <Route path="/teachers" element={<Teachers />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/" element={<Login />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
