
import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import MainContent from '@/components/dashboard/MainContent';
import PatientProfile from '@/components/dashboard/PatientProfile';
import PatientHistory from '@/components/dashboard/PatientHistory';
import PatientAnatomyActivity from '@/components/dashboard/PatientAnatomyActivity';

const DashboardPage: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="container p-4 md:p-6 mx-auto max-w-7xl">
            <h1 className="text-2xl font-bold mb-6">Doctor Dashboard</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <MainContent />
              </div>
              
              <div className="lg:col-span-4 space-y-6">
                <PatientProfile />
                <PatientAnatomyActivity />
                <PatientHistory />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
