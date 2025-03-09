
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import SettingsContent from '@/components/settings/SettingsContent';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-6 pl-10 lg:pl-0">
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-sm text-muted-foreground">
              Customize your experience, {user?.name || 'User'}
            </p>
          </div>
          
          <SettingsContent />
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
