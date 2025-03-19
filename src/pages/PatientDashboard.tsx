
import React from 'react';
import { SymptomProvider } from '@/contexts/SymptomContext';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import DashboardTabs from '@/components/patient-dashboard/DashboardTabs';
import DashboardMainContent from '@/components/patient-dashboard/DashboardMainContent';
import usePatientDashboard from '@/hooks/usePatientDashboard';

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  
  const {
    activityData,
    treatmentTasks,
    upcomingAppointments,
    healthMetrics,
    biologicalAge,
    chronologicalAge,
    hasConnectedApps,
    handleConfirmAppointment,
    handleRescheduleAppointment,
    handleSyncAllData
  } = usePatientDashboard();

  // Always default to dashboard tab, no special URL hash handling
  const initialTab = 'dashboard';

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 overflow-container bg-gray-50 dark:bg-gray-900">
          <div className="mb-6 pl-10 lg:pl-0">
            <h1 className="text-2xl font-bold">My Health Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {user?.name || 'Patient'}
            </p>
          </div>
          
          <SymptomProvider>
            <DashboardTabs
              initialTab={initialTab}
              upcomingAppointments={upcomingAppointments || []}
              onConfirmAppointment={handleConfirmAppointment}
              onRescheduleAppointment={handleRescheduleAppointment}
            >
              <DashboardMainContent
                healthMetrics={healthMetrics}
                activityData={activityData}
                treatmentTasks={treatmentTasks}
                upcomingAppointments={upcomingAppointments || []}
                biologicalAge={biologicalAge}
                chronologicalAge={chronologicalAge}
                hasConnectedApps={hasConnectedApps}
                onSyncData={handleSyncAllData}
                handleConfirmAppointment={handleConfirmAppointment}
                handleRescheduleAppointment={handleRescheduleAppointment}
              />
            </DashboardTabs>
          </SymptomProvider>
        </main>
      </div>
    </div>
  );
};

export default PatientDashboard;
