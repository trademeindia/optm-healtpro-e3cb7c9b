
import React from 'react';
import { useAuth } from '@/contexts/auth';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import OpenSimSettingsTab from '@/components/dashboard/OpenSimSettingsTab';

const OpenSimPage: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden w-full backdrop-blur-sm">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">OpenSim Configuration</h1>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Dr. {user?.name || 'User'}</span>
              </div>
            </div>
            
            <OpenSimSettingsTab />
          </div>
        </main>
      </div>
    </div>
  );
};

export default OpenSimPage;
