
import React from 'react';
import { SymptomProvider } from '@/contexts/SymptomContext';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import DashboardTabs from '@/components/patient-dashboard/DashboardTabs';
import usePatientDashboard from '@/hooks/usePatientDashboard';

// Import new enhanced components
import PatientProfileCard from '@/components/patient-dashboard/PatientProfileCard';
import EnhancedMetricsOverview from '@/components/patient-dashboard/EnhancedMetricsOverview';
import EnhancedBiologicalAgeMeter from '@/components/patient-dashboard/EnhancedBiologicalAgeMeter';
import EnhancedTreatmentTasks from '@/components/patient-dashboard/EnhancedTreatmentTasks';
import EnhancedAppointmentsList from '@/components/patient-dashboard/EnhancedAppointmentsList';
import FitnessDataCharts from '@/components/dashboard/FitnessDataCharts';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent } from '@/components/ui/tabs';

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
              upcomingAppointments={upcomingAppointments}
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
                  
                  {/* Patient Profile Card */}
                  <PatientProfileCard 
                    name={user?.name || 'Patient'} 
                    patientId={user?.id || 'ABC123'}
                    age={35}
                  />
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <EnhancedMetricsOverview metrics={healthMetrics} />
                    </div>
                    <div className="md:col-span-1">
                      <EnhancedBiologicalAgeMeter 
                        biologicalAge={biologicalAge} 
                        chronologicalAge={chronologicalAge} 
                      />
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
                  
                  {hasConnectedApps && <FitnessDataCharts fitnessData={activityData} />}
                  
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <EnhancedTreatmentTasks tasks={treatmentTasks} />
                    </div>
                    
                    <EnhancedAppointmentsList 
                      appointments={upcomingAppointments} 
                      onConfirm={handleConfirmAppointment}
                      onReschedule={handleRescheduleAppointment}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </DashboardTabs>
          </SymptomProvider>
        </main>
      </div>
    </div>
  );
};

export default PatientDashboard;
