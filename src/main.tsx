
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/base.css'
import './App.css'
import './styles/main.css'
import { Toaster } from 'sonner'

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', event => {
  console.error('Unhandled Promise Rejection:', event.reason);
  
  // Check if this is a Supabase connection error
  if (event.reason?.message?.includes('network') || 
      event.reason?.message?.includes('Failed to fetch') ||
      event.reason?.message?.includes('supabase')) {
    
    // Don't show multiple errors for the same issue
    if (!window.hasShownSupabaseError) {
      window.hasShownSupabaseError = true;
      
      // Reset flag after some time
      setTimeout(() => {
        window.hasShownSupabaseError = false;
      }, 60000); // Don't show another error for a minute
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Toaster richColors closeButton position="top-right" />
    <App />
  </React.StrictMode>,
)
