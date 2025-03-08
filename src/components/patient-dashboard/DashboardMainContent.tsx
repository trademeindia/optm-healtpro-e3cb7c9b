
import React from 'react';
import { Grid } from '@/components/ui/grid';
import HealthMetric from '@/components/dashboard/HealthMetric';
import TreatmentPlan from '@/components/dashboard/TreatmentPlan';
import UpcomingAppointmentsCard from '@/components/patient-dashboard/UpcomingAppointmentsCard';
import HealthSyncButton from '@/components/patient-dashboard/HealthSyncButton';
import PainLocationMap from '@/components/dashboard/PainLocationMap';
import SymptomTracker from '@/components/dashboard/SymptomTracker';
import MessageYourDoctor from '@/components/patient-dashboard/MessageYourDoctor';
import MedicalDocuments from '@/components/patient-dashboard/MedicalDocuments';
import ActivityTracker from '@/components/dashboard/ActivityTracker';

interface HealthMetric {
  title: string;
  value: string | number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  change?: string | number;
  changeType?: 'increase' | 'decrease';
  lastUpdated?: string;
  source?: string;
  icon?: React.ReactNode;
}

interface Activity {
  data: { day: string; value: number }[];
  currentValue: number;
  source?: string;
  lastSync?: string;
}

interface Task {
  id: string;
  title: string;
  time: string;
  completed: boolean;
}

interface DashboardMainContentProps {
  healthMetrics: {
    heartRate: HealthMetric;
    bloodPressure: HealthMetric;
    temperature: HealthMetric;
    oxygen: HealthMetric;
  };
  activityData: Activity;
  treatmentTasks: Task[];
  upcomingAppointments: {
    id: string;
    date: string;
    time: string;
    doctor: string;
    type: string;
  }[];
  hasConnectedApps: boolean;
  onSyncData: () => Promise<void>;
  onConfirmAppointment: (id: string) => void;
  onRescheduleAppointment: (id: string) => void;
}

const DashboardMainContent: React.FC<DashboardMainContentProps> = ({
  healthMetrics,
  activityData,
  treatmentTasks,
  upcomingAppointments,
  hasConnectedApps,
  onSyncData,
  onConfirmAppointment,
  onRescheduleAppointment
}) => {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full justify-end">
        <HealthSyncButton
          hasConnectedApps={hasConnectedApps}
          onSyncData={onSyncData}
        />
      </div>
      
      <Grid columns={12} className="gap-4 lg:gap-6">
        <HealthMetric
          className="col-span-12 sm:col-span-6 lg:col-span-3"
          title={healthMetrics.heartRate.title}
          value={healthMetrics.heartRate.value}
          unit={healthMetrics.heartRate.unit}
          change={Number(healthMetrics.heartRate.change)}
          status={healthMetrics.heartRate.status}
          source={healthMetrics.heartRate.source}
          lastSync={healthMetrics.heartRate.lastUpdated}
        />
        <HealthMetric
          className="col-span-12 sm:col-span-6 lg:col-span-3"
          title={healthMetrics.bloodPressure.title}
          value={healthMetrics.bloodPressure.value}
          unit={healthMetrics.bloodPressure.unit}
          change={Number(healthMetrics.bloodPressure.change)}
          status={healthMetrics.bloodPressure.status}
          source={healthMetrics.bloodPressure.source}
          lastSync={healthMetrics.bloodPressure.lastUpdated}
        />
        <HealthMetric
          className="col-span-12 sm:col-span-6 lg:col-span-3"
          title={healthMetrics.temperature.title}
          value={healthMetrics.temperature.value}
          unit={healthMetrics.temperature.unit}
          change={Number(healthMetrics.temperature.change)}
          status={healthMetrics.temperature.status}
          source={healthMetrics.temperature.source}
          lastSync={healthMetrics.temperature.lastUpdated}
        />
        <HealthMetric
          className="col-span-12 sm:col-span-6 lg:col-span-3"
          title={healthMetrics.oxygen.title}
          value={healthMetrics.oxygen.value}
          unit={healthMetrics.oxygen.unit}
          change={Number(healthMetrics.oxygen.change)}
          status={healthMetrics.oxygen.status}
          source={healthMetrics.oxygen.source}
          lastSync={healthMetrics.oxygen.lastUpdated}
        />
      </Grid>
      
      <Grid columns={12} className="gap-6">
        <ActivityTracker
          className="col-span-12 lg:col-span-7 xl:col-span-8"
          title="Daily Activity"
          unit="steps/day"
          data={activityData.data}
          currentValue={activityData.currentValue}
          source={activityData.source}
          lastSync={activityData.lastSync}
        />
        <TreatmentPlan
          className="col-span-12 lg:col-span-5 xl:col-span-4"
          title="Treatment Plan"
          date="Today"
          tasks={treatmentTasks}
          progress={75}
        />
      </Grid>
      
      <Grid columns={12} className="gap-6">
        <UpcomingAppointmentsCard
          className="col-span-12 md:col-span-6 xl:col-span-4"
          upcomingAppointments={upcomingAppointments}
          onConfirmAppointment={onConfirmAppointment}
          onRescheduleAppointment={onRescheduleAppointment}
        />
        <PainLocationMap 
          className="col-span-12 md:col-span-6 xl:col-span-4"
        />
        <SymptomTracker 
          className="col-span-12 xl:col-span-4"
        />
      </Grid>
      
      <Grid columns={12} className="gap-6">
        <MessageYourDoctor
          className="col-span-12 md:col-span-6"
        />
        <MedicalDocuments
          className="col-span-12 md:col-span-6"
        />
      </Grid>
    </div>
  );
};

export default DashboardMainContent;
