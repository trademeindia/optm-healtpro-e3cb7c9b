import React, { memo, useState, useEffect } from 'react';
import { SymptomProvider } from '@/contexts/SymptomContext';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import DashboardTabs from '@/components/patient-dashboard/DashboardTabs';
import DashboardMainContent from '@/components/patient-dashboard/DashboardMainContent';
import usePatientDashboard from '@/hooks/usePatientDashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, FileText, HeartPulse, Pill, Calendar, User, Map, LineChart } from 'lucide-react';
import ProgressTracking from '@/components/patient-dashboard/ProgressTracking';
import PatientOverview from '@/components/patient-dashboard/PatientOverview';
import MedicalReports from '@/components/patient-dashboard/MedicalReports';
import RealTimeVitals from '@/components/patient-dashboard/RealTimeVitals';
import { MuscleGroup } from '@/types/exercise.types';

// Memoize the component to prevent unnecessary re-renders
const PatientDashboard: React.FC = memo(() => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
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

  // Prevent excessive re-renders by using useEffect for any data syncing
  useEffect(() => {
    // Initial data sync on component mount
    const initialSync = setTimeout(() => {
      if (hasConnectedApps) {
        handleSyncAllData();
      }
    }, 1000);
    
    return () => clearTimeout(initialSync);
  }, [hasConnectedApps, handleSyncAllData]);

  // Sample data for muscle improvement progress tracking
  const muscleGroups: MuscleGroup[] = [
    { id: "1", name: 'Quadriceps', progress: 75 },
    { id: "2", name: 'Hamstrings', progress: 60 },
    { id: "3", name: 'Lower Back', progress: 45 },
    { id: "4", name: 'Shoulders', progress: 80 },
    { id: "5", name: 'Abdominals', progress: 65 }
  ];

  const progressData = [
    { date: 'Jan', strength: 40, flexibility: 30, endurance: 25 },
    { date: 'Feb', strength: 45, flexibility: 35, endurance: 30 },
    { date: 'Mar', strength: 55, flexibility: 40, endurance: 35 },
    { date: 'Apr', strength: 60, flexibility: 50, endurance: 40 },
    { date: 'May', strength: 70, flexibility: 60, endurance: 55 },
    { date: 'Jun', strength: 75, flexibility: 65, endurance: 60 }
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 overflow-container">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">My Health Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {user?.name || 'Patient'}
            </p>
          </div>
          
          <Card className="border shadow-sm mb-6">
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full justify-start p-0 rounded-none border-b bg-transparent h-auto">
                  <TabsTrigger 
                    value="overview" 
                    className="data-[state=active]:bg-background rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3 px-4"
                  >
                    <User className="w-4 h-4 mr-2" />
                    <span>Overview</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="progress" 
                    className="data-[state=active]:bg-background rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3 px-4"
                  >
                    <LineChart className="w-4 h-4 mr-2" />
                    <span>Progress</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="vitals" 
                    className="data-[state=active]:bg-background rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3 px-4"
                  >
                    <HeartPulse className="w-4 h-4 mr-2" />
                    <span>Vitals</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="reports" 
                    className="data-[state=active]:bg-background rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3 px-4"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    <span>Reports</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="treatment" 
                    className="data-[state=active]:bg-background rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3 px-4"
                  >
                    <Pill className="w-4 h-4 mr-2" />
                    <span>Treatment</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="p-4 m-0">
                  <PatientOverview 
                    user={user}
                    upcomingAppointments={upcomingAppointments}
                    healthMetrics={healthMetrics}
                    handleConfirmAppointment={handleConfirmAppointment}
                    handleRescheduleAppointment={handleRescheduleAppointment}
                  />
                </TabsContent>

                <TabsContent value="progress" className="p-4 m-0">
                  <ProgressTracking 
                    muscleGroups={muscleGroups}
                    progressData={progressData}
                  />
                </TabsContent>

                <TabsContent value="vitals" className="p-4 m-0">
                  <RealTimeVitals 
                    healthMetrics={healthMetrics}
                    hasConnectedApps={hasConnectedApps}
                    onSyncData={handleSyncAllData}
                  />
                </TabsContent>

                <TabsContent value="reports" className="p-4 m-0">
                  <MedicalReports />
                </TabsContent>

                <TabsContent value="treatment" className="p-4 m-0">
                  <SymptomProvider>
                    <DashboardTabs
                      initialTab="dashboard"
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
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
});

PatientDashboard.displayName = 'PatientDashboard';

export default PatientDashboard;
