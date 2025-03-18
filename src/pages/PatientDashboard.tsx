
import React, { useEffect, useState } from 'react';
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
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { AlertTriangle } from 'lucide-react';

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [visibilityError, setVisibilityError] = useState<string | null>(null);
  
  const {
    activityData,
    treatmentTasks,
    upcomingAppointments,
    healthMetrics,
    biologicalAge,
    chronologicalAge,
    hasConnectedApps,
    isLoading,
    error,
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
    
    // Attempt to diagnose visibility issues
    try {
      if (!document.querySelector('.overflow-container')) {
        setVisibilityError('Container element missing');
      }
      
      // Check if content might be hidden by CSS
      const hiddenElements = document.querySelectorAll('[class*="hidden"]:not([class*="sm:block"]):not([class*="md:block"]):not([class*="lg:block"]):not([class*="xl:block"])');
      if (hiddenElements.length > 0) {
        console.log('Potentially hidden elements found:', hiddenElements.length);
      }
    } catch (e) {
      console.error('Error checking visibility:', e);
    }
  }, []);

  // Handle errors in the dashboard
  const handleDashboardError = (error: Error) => {
    console.error('Error in Patient Dashboard:', error);
    toast.error('Dashboard Error', {
      description: 'There was a problem loading the dashboard. Please try refreshing the page.',
      duration: 5000
    });
  };

  // Show loading state when data is being fetched
  if (isLoading) {
    return (
      <div className="flex h-screen w-full overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden w-full">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 overflow-container">
            <div className="h-full w-full flex flex-col items-center justify-center">
              <Spinner size="lg" className="mb-4" />
              <p className="text-muted-foreground">Loading your health dashboard...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Show error state if there was a problem loading the dashboard data
  if (error || visibilityError) {
    return (
      <div className="flex h-screen w-full overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden w-full">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 overflow-container">
            <Card className="mx-auto max-w-lg mt-8">
              <CardContent className="p-6 text-center">
                <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Display Error</h2>
                <p className="text-muted-foreground mb-4">
                  {error?.message || visibilityError || 'There was a problem displaying your dashboard.'}
                </p>
                <button 
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
                  onClick={() => window.location.reload()}
                >
                  Reload Dashboard
                </button>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

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
                    handleReschedureAppointment={handleRescheduleAppointment}
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
