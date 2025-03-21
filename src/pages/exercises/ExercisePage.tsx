
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

const ExercisePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-6 pl-10 lg:pl-0">
            <h1 className="text-2xl font-bold">Exercise Therapy</h1>
            <p className="text-sm text-muted-foreground">
              Personalized exercises with AI-powered posture monitoring
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
            <div className="lg:col-span-12 space-y-4 bg-card p-6 rounded-lg border">
              <h2 className="text-xl font-semibold">Exercise Content Coming Soon</h2>
              <p>We're currently working on a comprehensive exercise library tailored to your needs.</p>
              <div className="flex justify-center py-8">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                    <path d="M6 8H5a4 4 0 0 0 0 8h1"></path>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ExercisePage;
