
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={onTabChange}
      className="w-full"
    >
      <TabsList className="mb-6 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
        <TabsTrigger value="overview" className="rounded-md">
          Overview
        </TabsTrigger>
        <TabsTrigger value="patients" className="rounded-md">
          Patients
        </TabsTrigger>
        <TabsTrigger value="reports" className="rounded-md">
          Reports & Documents
        </TabsTrigger>
        <TabsTrigger value="analytics" className="rounded-md">
          Analytics
        </TabsTrigger>
        <TabsTrigger value="calendar" className="rounded-md">
          Calendar
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default DashboardTabs;
