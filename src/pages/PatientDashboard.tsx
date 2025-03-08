
import React from 'react';
import { useLocation } from 'react-router-dom';
import { SymptomProvider } from '@/contexts/SymptomContext';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import DashboardTabs from '@/components/patient-dashboard/DashboardTabs';
import DashboardMainContent from '@/components/patient-dashboard/DashboardMainContent';
import usePatientDashboard from '@/hooks/usePatientDashboard';

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  const {
    activityData,
    treatmentTasks,
    healthMetrics,
    hasConnectedApps,
    handleSyncAllData
  } = usePatientDashboard();

  // Get current tab from URL or default to dashboard
  const getInitialTab = () => {
    if (location.hash === '#progress') return 'progress';
    if (location.hash === '#records') return 'records';
    return 'dashboard';
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-6 pl-10 lg:pl-0">
            <h1 className="text-2xl font-bold">My Health Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {user?.name || 'Patient'}
            </p>
          </div>
          
          <SymptomProvider>
            <DashboardTabs initialTab={getInitialTab()}>
              <DashboardMainContent
                healthMetrics={healthMetrics}
                activityData={activityData}
                treatmentTasks={treatmentTasks}
                hasConnectedApps={hasConnectedApps}
                onSyncData={handleSyncAllData}
              />
            </DashboardTabs>
          </SymptomProvider>
        </main>
      </div>
    </div>
  );
};

export default PatientDashboard;
