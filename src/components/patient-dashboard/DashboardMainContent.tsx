
import React from 'react';
import MobileLayout from './dashboard-layout/MobileLayout';
import DesktopLayout from './dashboard-layout/DesktopLayout';
import { DashboardMainContentProps } from './dashboard-layout/types';

const DashboardMainContent: React.FC<DashboardMainContentProps> = (props) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6">
      {/* Mobile layout - Stack everything in one column */}
      <MobileLayout {...props} />
      
      {/* Desktop layout - Three column grid */}
      <DesktopLayout {...props} />
    </div>
  );
};

export default DashboardMainContent;
