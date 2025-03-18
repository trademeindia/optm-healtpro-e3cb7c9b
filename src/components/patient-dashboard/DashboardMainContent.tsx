
import React, { useState } from 'react';
import LeftColumn from './dashboard-layout/LeftColumn';
import RightColumn from './dashboard-layout/RightColumn';
import { RescheduleDialog } from './appointments';
import { usePatientAppointments } from '@/hooks/dashboard/usePatientAppointments';
import { DashboardMainContentProps } from './dashboard-layout/types';

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
  const {
    appointments,
    selectedAppointment,
    rescheduleDialogOpen,
    setRescheduleDialogOpen,
    handleConfirmAppointment: confirmAppointment,
    openRescheduleDialog,
    handleRescheduleAppointment: rescheduleAppointment
  } = usePatientAppointments(upcomingAppointments);
  
  // Handle appointment confirmation, using either the prop or the hook function
  const onConfirmAppointment = (id: string) => {
    if (handleConfirmAppointment) {
      handleConfirmAppointment(id);
    } else {
      confirmAppointment(id);
    }
  };
  
  // Handle appointment rescheduling
  const onRescheduleAppointment = (id: string) => {
    openRescheduleDialog(id);
  };

  return (
    <div className="pt-1 grid grid-cols-1 lg:grid-cols-7 gap-4 md:gap-6 w-full max-w-[1600px] mx-auto">
      <LeftColumn 
        activityData={activityData}
        upcomingAppointments={appointments}
        handleConfirmAppointment={onConfirmAppointment}
        handleRescheduleAppointment={onRescheduleAppointment}
        biologicalAge={biologicalAge}
        chronologicalAge={chronologicalAge}
        hasConnectedApps={hasConnectedApps}
        onSyncData={onSyncData}
        healthMetrics={healthMetrics}
        treatmentTasks={treatmentTasks}
      />
      
      <RightColumn 
        treatmentTasks={treatmentTasks}
        biologicalAge={biologicalAge}
        chronologicalAge={chronologicalAge}
      />
      
      <RescheduleDialog 
        appointment={selectedAppointment}
        open={rescheduleDialogOpen}
        onOpenChange={setRescheduleDialogOpen}
        onReschedule={rescheduleAppointment}
      />
    </div>
  );
};

export default DashboardMainContent;
