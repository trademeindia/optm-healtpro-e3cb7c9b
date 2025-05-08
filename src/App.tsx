
import { Suspense } from 'react';
import AppRoutes from './routes/Routes';
import './App.css';
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <Suspense fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      }>
        <AppRoutes />
      </Suspense>
      <Toaster position="bottom-right" richColors />
    </>
  );
}

export default App;
