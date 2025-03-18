
import React from 'react';
import MobileLayout from './dashboard-layout/MobileLayout';
import DesktopLayout from './dashboard-layout/DesktopLayout';
import { DashboardMainContentProps } from './dashboard-layout/types';

const DashboardMainContent: React.FC<DashboardMainContentProps> = (props) => {
  return (
    <div className="w-full space-y-6 bg-gray-50 dark:bg-gray-900">
      {/* Mobile layout - Stack everything in one column */}
      <div className="block md:hidden">
        <MobileLayout {...props} />
      </div>
      
      {/* Desktop layout - Three column grid */}
      <div className="hidden md:block">
        <DesktopLayout {...props} />
      </div>
    </div>
  );
};

export default DashboardMainContent;
