
import React from 'react';
import LeftColumn from './LeftColumn';
import MiddleColumn from './MiddleColumn';
import RightColumn from './RightColumn';
import { DashboardMainContentProps } from './types';
import { transformHealthMetrics, transformActivityData, transformTreatmentTasks, transformAppointments } from '@/utils/dashboardDataAdapter';

const DesktopLayout: React.FC<DashboardMainContentProps> = (props) => {
  // Transform the data before passing to columns
  const healthMetrics = transformHealthMetrics(props.healthMetrics);
  const activityData = transformActivityData(props.activityData);
  const treatmentTasks = transformTreatmentTasks(props.treatmentTasks);
  const upcomingAppointments = transformAppointments(props.upcomingAppointments);

  return (
    <div className="hidden lg:grid lg:grid-cols-12 lg:gap-6">
      {/* Left column */}
      <LeftColumn 
        healthMetrics={healthMetrics}
        activityData={activityData}
        treatmentTasks={treatmentTasks}
        upcomingAppointments={upcomingAppointments}
        biologicalAge={props.biologicalAge}
        chronologicalAge={props.chronologicalAge}
        hasConnectedApps={props.hasConnectedApps}
        onSyncData={props.onSyncData}
        handleConfirmAppointment={props.handleConfirmAppointment}
        handleRescheduleAppointment={props.handleRescheduleAppointment}
      />
      
      {/* Middle column - health metrics and treatment */}
      <MiddleColumn 
        healthMetrics={healthMetrics}
        activityData={activityData}
        treatmentTasks={treatmentTasks}
        upcomingAppointments={upcomingAppointments}
        biologicalAge={props.biologicalAge}
        chronologicalAge={props.chronologicalAge}
        hasConnectedApps={props.hasConnectedApps}
        onSyncData={props.onSyncData}
        handleConfirmAppointment={props.handleConfirmAppointment}
        handleRescheduleAppointment={props.handleRescheduleAppointment}
      />
      
      {/* Right column - symptom tracker, documents, messages */}
      <RightColumn />
    </div>
  );
};

export default DesktopLayout;
