
import React from 'react';
import MobileLayout from './dashboard-layout/MobileLayout';
import DesktopLayout from './dashboard-layout/DesktopLayout';
import { DashboardMainContentProps } from './dashboard-layout/types';

const DashboardMainContent: React.FC<DashboardMainContentProps> = (props) => {
  // Ensure the props are correctly passed down
  const fixedProps = {
    ...props,
    // Fix the misspelled prop and ensure onSyncData returns a Promise
    handleRescheduleAppointment: props.handleRescheduleAppointment || props.handleReschedureAppointment,
    onSyncData: async () => {
      return props.onSyncData();
    }
  };
  
  return (
    <div className="w-full space-y-6">
      {/* Mobile layout - Stack everything in one column */}
      <div className="block md:hidden">
        <MobileLayout {...fixedProps} />
      </div>
      
      {/* Desktop layout - Three column grid */}
      <div className="hidden md:block">
        <DesktopLayout {...fixedProps} />
      </div>
    </div>
  );
};

export default DashboardMainContent;
