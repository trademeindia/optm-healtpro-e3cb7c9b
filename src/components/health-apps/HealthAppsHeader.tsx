
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface HealthAppsHeaderProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const HealthAppsHeader: React.FC<HealthAppsHeaderProps> = ({ activeTab, onTabChange }) => {
  return (
    <>
      <div className="mb-6 pl-10 lg:pl-0">
        <h1 className="text-2xl font-bold">Health Apps</h1>
        <p className="text-sm text-muted-foreground">
          Connect and manage your health and fitness applications
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={onTabChange} className="mb-6">
        <TabsList>
          <TabsTrigger value="integrations">Health App Integrations</TabsTrigger>
          <TabsTrigger value="googlefit">Google Fit Sync</TabsTrigger>
        </TabsList>
      </Tabs>
    </>
  );
};

export default HealthAppsHeader;
