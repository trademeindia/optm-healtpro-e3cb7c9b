
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Dashboard from './pages/dashboard/DashboardPage';
import PatientDashboard from './pages/PatientDashboard';
import { AuthProvider } from './contexts/AuthContext';
import '@/App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patient" element={<PatientDashboard />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Router>
      <Toaster position="top-right" richColors />
    </AuthProvider>
  );
}

export default App;
