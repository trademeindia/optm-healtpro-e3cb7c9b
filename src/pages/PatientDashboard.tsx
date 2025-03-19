
import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import DashboardMainContent from '@/components/patient-dashboard/DashboardMainContent';
import LeftColumn from '@/components/patient-dashboard/dashboard-layout/LeftColumn';
import RightColumn from '@/components/patient-dashboard/dashboard-layout/RightColumn';
import RecentAnatomyActivity from '@/components/patient-dashboard/RecentAnatomyActivity';
import usePatientDashboard from '@/hooks/usePatientDashboard';

const PatientDashboard: React.FC = () => {
  const {
    activityData,
    fitnessData,
    treatmentTasks,
    upcomingAppointments,
    healthMetrics,
    hasConnectedApps,
    biologicalAge,
    chronologicalAge,
    handleConfirmAppointment,
    handleRescheduleAppointment,
    handleSyncAllData
  } = usePatientDashboard();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4 md:p-6 max-w-7xl">
            <h1 className="text-2xl font-bold mb-6">Patient Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Column (4 columns on md screens) */}
              <div className="md:col-span-3 space-y-6">
                <LeftColumn />
                <RecentAnatomyActivity />
              </div>
              
              {/* Main Content (5 columns on md screens) */}
              <div className="md:col-span-6">
                <DashboardMainContent 
                  healthMetrics={healthMetrics}
                  activityData={activityData}
                  treatmentTasks={treatmentTasks}
                  upcomingAppointments={upcomingAppointments}
                  biologicalAge={biologicalAge}
                  chronologicalAge={chronologicalAge}
                  hasConnectedApps={hasConnectedApps}
                  onSyncData={handleSyncAllData}
                  handleConfirmAppointment={handleConfirmAppointment}
                  handleRescheduleAppointment={handleRescheduleAppointment}
                />
              </div>
              
              {/* Right Column (3 columns on md screens) */}
              <div className="md:col-span-3">
                <RightColumn />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientDashboard;
