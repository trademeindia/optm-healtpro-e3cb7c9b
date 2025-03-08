
import React from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ActivityTracker from '@/components/dashboard/ActivityTracker';
import HealthMetric from '@/components/dashboard/HealthMetric';
import TreatmentPlan from '@/components/dashboard/TreatmentPlan';
import PostureAnalysis from '@/components/dashboard/PostureAnalysis';
import SymptomTracker from '@/components/dashboard/SymptomTracker';
import AnatomicalMap from '@/components/patient/AnatomicalMap';
import SymptomProgressChart from '@/components/dashboard/SymptomProgressChart';
import PersonalInformation from './PersonalInformation';
import UpcomingAppointmentsCard from './UpcomingAppointmentsCard';
import MedicalDocuments from './MedicalDocuments';
import MessageYourDoctor from './MessageYourDoctor';
import HealthSyncButton from './HealthSyncButton';
import { Heart, Activity, Thermometer, Droplet } from 'lucide-react';

interface DashboardMainContentProps {
  healthMetrics: {
    heartRate: { value: string | number; unit: string; change: number; source?: string; lastSync?: string };
    bloodPressure: { value: string; unit: string; change: number; source?: string; lastSync?: string };
    temperature: { value: string | number; unit: string; change: number; source?: string; lastSync?: string };
    oxygen: { value: string | number; unit: string; change: number; source?: string; lastSync?: string };
  };
  activityData: {
    data: { day: string; value: number }[];
    currentValue: number;
    source?: string;
    lastSync?: string;
  };
  treatmentTasks: {
    id: string;
    title: string;
    time: string;
    completed: boolean;
  }[];
  upcomingAppointments: {
    id: string;
    date: string;
    time: string;
    doctor: string;
    type: string;
  }[];
  hasConnectedApps: boolean;
  onSyncData: () => Promise<void>;
}

const DashboardMainContent: React.FC<DashboardMainContentProps> = ({
  healthMetrics,
  activityData,
  treatmentTasks,
  upcomingAppointments,
  hasConnectedApps,
  onSyncData
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left column */}
      <div className="lg:col-span-3 space-y-6">
        <PersonalInformation />
        
        {/* Activity Tracker with fitness data if available */}
        <ActivityTracker
          title="Your Activity (Steps)"
          data={activityData.data}
          unit="steps/day"
          currentValue={activityData.currentValue}
          source={activityData.source}
          lastSync={activityData.lastSync}
        />
        
        {/* Upcoming Appointments */}
        <UpcomingAppointmentsCard 
          upcomingAppointments={upcomingAppointments}
        />
      </div>
      
      {/* Middle column - health metrics and treatment */}
      <div className="lg:col-span-5 space-y-6">
        {/* Health Data Sync Button */}
        <HealthSyncButton 
          hasConnectedApps={hasConnectedApps}
          onSyncData={onSyncData}
        />
        
        {/* Health Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <HealthMetric
            title="Heart Rate"
            value={healthMetrics.heartRate.value}
            unit={healthMetrics.heartRate.unit}
            change={healthMetrics.heartRate.change}
            changeLabel="vs last week"
            icon={<Heart className="w-4 h-4" />}
            color="bg-medical-red/10 text-medical-red"
            source={healthMetrics.heartRate.source}
            lastSync={healthMetrics.heartRate.lastSync}
            isConnected={!!healthMetrics.heartRate.source}
          />
          
          <HealthMetric
            title="Blood Pressure"
            value={healthMetrics.bloodPressure.value}
            unit={healthMetrics.bloodPressure.unit}
            change={healthMetrics.bloodPressure.change}
            changeLabel="stable"
            icon={<Activity className="w-4 h-4" />}
            color="bg-medical-blue/10 text-medical-blue"
            source={healthMetrics.bloodPressure.source}
            lastSync={healthMetrics.bloodPressure.lastSync}
            isConnected={!!healthMetrics.bloodPressure.source}
          />
          
          <HealthMetric
            title="Temperature"
            value={healthMetrics.temperature.value}
            unit={healthMetrics.temperature.unit}
            change={healthMetrics.temperature.change}
            changeLabel="vs yesterday"
            icon={<Thermometer className="w-4 h-4" />}
            color="bg-medical-yellow/10 text-medical-yellow"
            source={healthMetrics.temperature.source}
            lastSync={healthMetrics.temperature.lastSync}
            isConnected={!!healthMetrics.temperature.source}
          />
          
          <HealthMetric
            title="Oxygen"
            value={healthMetrics.oxygen.value}
            unit={healthMetrics.oxygen.unit}
            change={healthMetrics.oxygen.change}
            changeLabel="vs last check"
            icon={<Droplet className="w-4 h-4" />}
            color="bg-medical-green/10 text-medical-green"
            source={healthMetrics.oxygen.source}
            lastSync={healthMetrics.oxygen.lastSync}
            isConnected={!!healthMetrics.oxygen.source}
          />
        </div>
        
        {/* Treatment Plan */}
        <TreatmentPlan
          title="Today's Treatment Plan"
          date="Jun 15, 2023"
          tasks={treatmentTasks}
          progress={50}
        />
        
        {/* PostureAnalysis Component */}
        <PostureAnalysis />
      </div>
      
      {/* Right column - symptom tracker, documents, messages */}
      <div className="lg:col-span-4 space-y-6">
        {/* Progress Chart (moved from tabs to right panel) */}
        <div className="glass-morphism rounded-2xl p-6">
          <SymptomProgressChart />
        </div>
        
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
  );
};

export default DashboardMainContent;
