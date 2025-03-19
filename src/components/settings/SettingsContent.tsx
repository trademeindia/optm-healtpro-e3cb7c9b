
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileSettings from './ProfileSettings';
import DashboardSettings from './DashboardSettings';
import NotificationSettings from './NotificationSettings';
import IntegrationSettings from './IntegrationSettings';
import SecuritySettings from './SecuritySettings';

const SettingsContent: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6 grid grid-cols-2 md:grid-cols-5 gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          <TabsTrigger value="profile" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600">Profile</TabsTrigger>
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600">Dashboard</TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600">Notifications</TabsTrigger>
          <TabsTrigger value="integrations" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600">Integrations</TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-4">
          <ProfileSettings />
        </TabsContent>
        
        <TabsContent value="dashboard" className="mt-4">
          <DashboardSettings />
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-4">
          <NotificationSettings />
        </TabsContent>
        
        <TabsContent value="integrations" className="mt-4">
          <IntegrationSettings />
        </TabsContent>
        
        <TabsContent value="security" className="mt-4">
          <SecuritySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsContent;
