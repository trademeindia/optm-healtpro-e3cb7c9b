
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { SymptomProvider } from '@/contexts/SymptomContext';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import DashboardTabs from '@/components/patient-dashboard/DashboardTabs';
import usePatientDashboard from '@/hooks/usePatientDashboard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { FitnessData } from '@/hooks/useFitnessIntegration';
import ErrorBoundary from '@/pages/dashboard/components/ErrorBoundary';
import { AppointmentWithProvider } from '@/types/appointments';

const PatientProfileCard = React.lazy(() => import('@/components/patient-dashboard/PatientProfileCard'));
const EnhancedMetricsOverview = React.lazy(() => import('@/components/patient-dashboard/EnhancedMetricsOverview'));
const EnhancedBiologicalAgeMeter = React.lazy(() => import('@/components/patient-dashboard/EnhancedBiologicalAgeMeter'));
const EnhancedTreatmentTasks = React.lazy(() => import('@/components/patient-dashboard/EnhancedTreatmentTasks'));
const EnhancedAppointmentsList = React.lazy(() => import('@/components/patient-dashboard/EnhancedAppointmentsList'));
const FitnessDataCharts = React.lazy(() => import('@/components/dashboard/FitnessDataCharts'));
const AnatomicalBodyMap = React.lazy(() => import('@/components/patient-dashboard/AnatomicalBodyMap'));
const RealTimeHealthMetrics = React.lazy(() => import('@/components/patient-dashboard/RealTimeHealthMetrics'));
const AIHealthInsights = React.lazy(() => import('@/components/patient-dashboard/AIHealthInsights'));

const defaultFitnessData: FitnessData = {
  steps: {
    data: [],
    summary: { total: 0, average: 0 }
  },
  heartRate: {
    data: [],
    summary: { average: 0, min: 0, max: 0 }
  },
  calories: {
    data: [],
    summary: { total: 0, average: 0 }
  }
};

const ComponentSkeleton = () => (
  <div className="w-full h-32 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
);

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const {
    activityData,
    fitnessData,
    treatmentTasks,
    upcomingAppointments,
    healthMetrics,
    biologicalAge,
    chronologicalAge,
    hasConnectedApps,
    handleConfirmAppointment,
    handleRescheduleAppointment,
    handleSyncAllData,
    isLoading,
    error
  } = usePatientDashboard();

  const formattedAppointments: AppointmentWithProvider[] = upcomingAppointments.map(appointment => ({
    id: appointment.id,
    patientId: appointment.patientId || 'patient-1',
    providerId: appointment.providerId || 'doc-1',
    date: appointment.date,
    time: appointment.time,
    status: appointment.status || 'scheduled',
    type: appointment.type,
    location: appointment.location || 'Main Clinic',
    provider: appointment.provider || {
      id: appointment.providerId || 'doc-1',
      name: appointment.doctor,
      specialty: 'General Medicine',
    }
  }));

  useEffect(() => {
    if (error) {
      console.error("Dashboard error detected:", error);
      setHasError(true);
    }
  }, [error]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        console.log("Loading timeout triggered");
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [isLoading]);

  const handleRetry = () => {
    setHasError(false);
    setRetryCount(prev => prev + 1);
    window.location.reload();
  };

  const initialTab = 'dashboard';

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-md w-full">
          <Spinner size="lg" className="mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Loading dashboard...</h2>
          <p className="text-muted-foreground">Please wait while we prepare your content</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-md w-full">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">We encountered a problem loading your dashboard</p>
          <Button onClick={handleRetry}>Try Again</Button>
        </div>
      </div>
    );
  }

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
          
          <ErrorBoundary onError={(error) => console.error("Error boundary caught:", error)}>
            <SymptomProvider>
              <DashboardTabs
                initialTab={initialTab}
                upcomingAppointments={formattedAppointments}
                onConfirmAppointment={handleConfirmAppointment}
                onRescheduleAppointment={handleRescheduleAppointment}
              >
                <Tabs defaultValue="dashboard">
                  <TabsContent value="dashboard" className="space-y-6">
                    {!hasConnectedApps && (
                      <Alert variant="default" className="bg-primary/5 border border-primary/20">
                        <AlertCircle className="h-4 w-4 text-primary" />
                        <AlertTitle>No connected health apps</AlertTitle>
                        <AlertDescription className="flex justify-between items-center">
                          <span>
                            Connect your health apps to see more accurate health data.
                          </span>
                          <Button variant="outline" size="sm" asChild>
                            <a href="/health-apps">Connect Apps</a>
                          </Button>
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="grid md:grid-cols-12 gap-4">
                      <div className="md:col-span-4">
                        <Suspense fallback={<ComponentSkeleton />}>
                          <PatientProfileCard 
                            name={user?.name || 'Patient'} 
                            patientId={user?.id || 'ABC123'}
                            age={chronologicalAge || 35}
                          />
                        </Suspense>
                      </div>
                      <div className="md:col-span-8">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm h-full overflow-hidden">
                          <Suspense fallback={<ComponentSkeleton />}>
                            <AnatomicalBodyMap />
                          </Suspense>
                        </div>
                      </div>
                    </div>
                    
                    {healthMetrics && healthMetrics.length > 0 && (
                      <Suspense fallback={<ComponentSkeleton />}>
                        <RealTimeHealthMetrics metrics={healthMetrics} />
                      </Suspense>
                    )}
                    
                    {fitnessData && Object.keys(fitnessData).length > 0 && (
                      <Suspense fallback={<ComponentSkeleton />}>
                        <AIHealthInsights fitnessData={fitnessData || defaultFitnessData} />
                      </Suspense>
                    )}
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <Suspense fallback={<ComponentSkeleton />}>
                          <EnhancedMetricsOverview metrics={healthMetrics || []} />
                        </Suspense>
                      </div>
                      <div className="md:col-span-1">
                        <Suspense fallback={<ComponentSkeleton />}>
                          <EnhancedBiologicalAgeMeter 
                            biologicalAge={biologicalAge} 
                            chronologicalAge={chronologicalAge} 
                          />
                        </Suspense>
                      </div>
                    </div>
                    
                    {hasConnectedApps && (
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Your Fitness Activity</h3>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleSyncAllData}
                          className="gap-1.5"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          <span>Sync Data</span>
                        </Button>
                      </div>
                    )}
                    
                    {hasConnectedApps && fitnessData && (
                      <Suspense fallback={<ComponentSkeleton />}>
                        <FitnessDataCharts fitnessData={fitnessData || defaultFitnessData} />
                      </Suspense>
                    )}
                    
                    <div className="grid lg:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <Suspense fallback={<ComponentSkeleton />}>
                          <EnhancedTreatmentTasks tasks={treatmentTasks || []} />
                        </Suspense>
                      </div>
                      
                      <Suspense fallback={<ComponentSkeleton />}>
                        <EnhancedAppointmentsList 
                          appointments={formattedAppointments} 
                          onConfirm={handleConfirmAppointment}
                          onReschedule={handleRescheduleAppointment}
                        />
                      </Suspense>
                    </div>
                  </TabsContent>
                </Tabs>
              </DashboardTabs>
            </SymptomProvider>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export default PatientDashboard;
