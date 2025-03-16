
import React, { ErrorInfo, Component, ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Dashboard from './pages/dashboard/DashboardPage';
import PatientDashboard from './pages/PatientDashboard';
import Index from './pages/Index';
import '@/App.css';

// Error boundary component
class ErrorBoundary extends Component<{ children: ReactNode, fallback: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode, fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

// Error fallback component
const ErrorFallback = () => (
  <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
    <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
    <p className="mb-6 max-w-md mx-auto">
      We're sorry, but there was an error loading this page. Try refreshing the browser.
    </p>
    <button 
      onClick={() => window.location.href = '/'}
      className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
    >
      Go Home
    </button>
  </div>
);

function App() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patient" element={<PatientDashboard />} />
          <Route path="/" element={<Index />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" richColors />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
