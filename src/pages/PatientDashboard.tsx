import React from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import TreatmentPlan from '@/components/dashboard/TreatmentPlan';
import AnatomicalMap from '@/components/patient/AnatomicalMap';
import SymptomProgressChart from '@/components/dashboard/SymptomProgressChart';
import PostureAnalysis from '@/components/dashboard/PostureAnalysis';
import UpcomingDoctorAppointments from '@/components/patient/UpcomingDoctorAppointments';
import DoctorMessages from '@/components/patient/DoctorMessages';
import ActivityTracker from '@/components/dashboard/ActivityTracker';
import { useAuth } from '@/contexts/AuthContext';
import { SymptomProvider } from '@/contexts/SymptomContext';

// Import refactored components
import PersonalInformation from '@/components/patient/dashboard/PersonalInformation';
import HealthDataSync from '@/components/patient/dashboard/HealthDataSync';
import HealthMetricsGrid from '@/components/patient/dashboard/HealthMetricsGrid';
import MedicalDocuments from '@/components/patient/dashboard/MedicalDocuments';
import MessageYourDoctor from '@/components/patient/dashboard/MessageYourDoctor';
import SymptomTracker from '@/components/dashboard/SymptomTracker';

// Import custom hooks
import { useHealthData } from '@/hooks/useHealthData';
import { useTreatmentPlan } from '@/hooks/useTreatmentPlan';
import { useDoctorCommunication } from '@/hooks/useDoctorCommunication';

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const { hasConnectedApps, handleSyncAllData, healthMetrics } = useHealthData();
  const { treatmentTasks, progress } = useTreatmentPlan();
  const { appointments, messages, handlers } = useDoctorCommunication();

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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left column */}
              <div className="lg:col-span-3 space-y-6">
                {/* Personal Information */}
                <PersonalInformation />
                
                {/* Activity Tracker with fitness data if available */}
                <ActivityTracker
                  title="Your Activity (Steps)"
                  data={healthMetrics.steps.data}
                  unit="steps/day"
                  currentValue={healthMetrics.steps.currentValue}
                  source={healthMetrics.steps.source}
                  lastSync={healthMetrics.steps.lastSync}
                />
                
                {/* Upcoming Doctor Appointments */}
                <UpcomingDoctorAppointments
                  appointments={appointments}
                  onViewAll={handlers.viewAllAppointments}
                  onConfirm={handlers.confirmAppointment}
                  onReschedule={handlers.rescheduleAppointment}
                />
              </div>
              
              {/* Middle column - health metrics and treatment */}
              <div className="lg:col-span-5 space-y-6">
                {/* Health Data Sync Button */}
                <HealthDataSync 
                  onSyncData={handleSyncAllData}
                  hasConnectedApps={hasConnectedApps}
                />
                
                {/* Health Metrics */}
                <HealthMetricsGrid
                  heartRate={healthMetrics.heartRate}
                  bloodPressure={healthMetrics.bloodPressure}
                  temperature={healthMetrics.temperature}
                  oxygen={healthMetrics.oxygen}
                />
                
                {/* Treatment Plan */}
                <TreatmentPlan
                  title="Today's Treatment Plan"
                  date="Jun 15, 2023"
                  tasks={treatmentTasks}
                  progress={progress}
                />
                
                {/* PostureAnalysis Component */}
                <PostureAnalysis />
                
                {/* Progress Chart */}
                <SymptomProgressChart />
              </div>
              
              {/* Right column - symptom tracker, documents, messages */}
              <div className="lg:col-span-4 space-y-6">
                {/* Doctor Messages */}
                <DoctorMessages
                  messages={messages}
                  onViewAll={handlers.viewAllMessages}
                  onReadMessage={handlers.readMessage}
                />
                
                {/* Symptom Tracker - Now connected via SymptomContext */}
                <SymptomTracker />
                
                {/* Anatomical Map - Now connected via SymptomContext */}
                <AnatomicalMap />
                
                {/* Medical Documents */}
                <MedicalDocuments />
                
                {/* Message Your Doctor */}
                <MessageYourDoctor />
              </div>
            </div>
          </SymptomProvider>
        </main>
      </div>
    </div>
  );
};

export default PatientDashboard;
