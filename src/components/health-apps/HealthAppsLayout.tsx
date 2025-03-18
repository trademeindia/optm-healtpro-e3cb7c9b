
import React from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import HealthAppsContent from '@/components/health-apps/HealthAppsContent';

const HealthAppsLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header />
        <HealthAppsContent />
      </div>
    </div>
  );
};

export default HealthAppsLayout;
