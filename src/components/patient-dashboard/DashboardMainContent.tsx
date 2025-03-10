
import React from 'react';
import { Appointment } from '@/services/calendar/types';
import HealthMetric from '@/components/dashboard/HealthMetric';
import BiologicalAge from '@/components/dashboard/BiologicalAge';
import ActivityTracker from '@/components/dashboard/ActivityTracker';
import TreatmentPlan from '@/components/dashboard/TreatmentPlan';
import UpcomingAppointments from '@/components/dashboard/UpcomingAppointments';
import HealthSyncButton from '@/components/patient-dashboard/HealthSyncButton';
import MessageYourDoctor from '@/components/patient-dashboard/MessageYourDoctor';
import MedicalDocuments from '@/components/patient-dashboard/MedicalDocuments';
import PersonalInformation from '@/components/patient-dashboard/PersonalInformation';
import SymptomTracker from '@/components/dashboard/SymptomTracker';

interface DashboardMainContentProps {
  healthMetrics: {
    heartRate: { value: number; unit: string; change: number };
    bloodPressure: { value: string; unit: string; change: number };
    temperature: { value: number; unit: string; change: number };
    oxygen: { value: number; unit: string; change: number };
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
  upcomingAppointments: Appointment[];
  biologicalAge: number;
  chronologicalAge: number;
  hasConnectedApps: boolean;
  onSyncData: () => void;
  handleConfirmAppointment: (id: string) => void;
  handleRescheduleAppointment: (id: string) => void;
}

const DashboardMainContent: React.FC<DashboardMainContentProps> = ({
  healthMetrics,
  activityData,
  treatmentTasks,
  upcomingAppointments,
  biologicalAge,
  chronologicalAge,
  hasConnectedApps,
  onSyncData,
  handleConfirmAppointment,
  handleRescheduleAppointment
}) => {
  // Format appointments for the UpcomingAppointments component
  const formattedAppointments = upcomingAppointments.map(appointment => ({
    id: appointment.id,
    date: appointment.date,
    time: appointment.time,
    doctor: appointment.doctorName,
    type: appointment.type
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {/* Health metrics section */}
      <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <HealthMetric
          title="Heart Rate"
          value={healthMetrics.heartRate.value}
          unit={healthMetrics.heartRate.unit}
          change={healthMetrics.heartRate.change}
        />
        <HealthMetric
          title="Blood Pressure"
          value={healthMetrics.bloodPressure.value}
          unit={healthMetrics.bloodPressure.unit}
          change={healthMetrics.bloodPressure.change}
        />
        <HealthMetric
          title="Temperature"
          value={healthMetrics.temperature.value}
          unit={healthMetrics.temperature.unit}
          change={healthMetrics.temperature.change}
        />
        <HealthMetric
          title="Oxygen Saturation"
          value={healthMetrics.oxygen.value}
          unit={healthMetrics.oxygen.unit}
          change={healthMetrics.oxygen.change}
        />
      </div>

      {/* Biological age card */}
      <div className="md:col-span-1">
        <BiologicalAge
          biologicalAge={biologicalAge}
          chronologicalAge={chronologicalAge}
        />
      </div>

      {/* Activity tracker */}
      <div className="md:col-span-2">
        <ActivityTracker
          activityData={activityData.data}
          currentSteps={activityData.currentValue}
        />
      </div>

      {/* Health sync button */}
      <div className="md:col-span-1">
        <HealthSyncButton
          hasConnectedApps={hasConnectedApps}
          onSyncData={onSyncData}
        />
      </div>

      {/* Treatment plan */}
      <div className="md:col-span-2">
        <TreatmentPlan tasks={treatmentTasks} />
      </div>

      {/* Upcoming appointments */}
      <div className="md:col-span-1">
        <UpcomingAppointments
          appointments={formattedAppointments}
          onConfirm={handleConfirmAppointment}
          onReschedule={handleRescheduleAppointment}
        />
      </div>

      {/* Message your doctor */}
      <div className="md:col-span-1">
        <MessageYourDoctor />
      </div>

      {/* Medical documents */}
      <div className="md:col-span-1">
        <MedicalDocuments />
      </div>

      {/* Personal information */}
      <div className="md:col-span-1">
        <PersonalInformation />
      </div>

      {/* Symptom tracker */}
      <div className="md:col-span-3">
        <SymptomTracker />
      </div>
    </div>
  );
};

export default DashboardMainContent;
