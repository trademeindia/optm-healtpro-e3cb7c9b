
import React from 'react';
import PatientReports from '@/components/patient/PatientReports';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

const PatientReportsPage: React.FC = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-6xl mx-auto">
            <PatientReports />
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientReportsPage;
