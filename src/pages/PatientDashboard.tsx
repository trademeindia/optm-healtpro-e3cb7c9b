
import React, { useEffect } from 'react';
import { SymptomProvider } from '@/contexts/SymptomContext';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import DashboardTabs from '@/components/patient-dashboard/DashboardTabs';
import DashboardMainContent from '@/components/patient-dashboard/DashboardMainContent';
import usePatientDashboard from '@/hooks/usePatientDashboard';
import ErrorBoundary from '@/components/error-boundary/ErrorBoundary';
import { toast } from 'sonner';
import { checkAppointmentEventsSystem } from '@/hooks/calendar/event-manager/utils/appointmentEvents';

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

  // Check appointment events system on mount
  useEffect(() => {
    const eventsWorking = checkAppointmentEventsSystem();
    console.log('Appointment events system check:', eventsWorking ? 'PASSED' : 'FAILED');
  }, []);

  // Handle errors in the dashboard
  const handleDashboardError = (error: Error) => {
    console.error('Error in Patient Dashboard:', error);
    toast.error('Dashboard Error', {
      description: 'There was a problem loading the dashboard. Please try refreshing the page.',
      duration: 5000
    });
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 overflow-container">
          <div className="mb-6 pl-10 lg:pl-0">
            <h1 className="text-2xl font-bold">My Health Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {user?.name || 'Patient'}
            </p>
          </div>
          
          <ErrorBoundary onError={handleDashboardError}>
            <SymptomProvider>
              <DashboardTabs
                initialTab={initialTab}
                upcomingAppointments={upcomingAppointments || []}
                onConfirmAppointment={handleConfirmAppointment}
                onRescheduleAppointment={handleRescheduleAppointment}
              >
                <ErrorBoundary>
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
                </ErrorBoundary>
              </DashboardTabs>
            </SymptomProvider>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export default PatientDashboard;
