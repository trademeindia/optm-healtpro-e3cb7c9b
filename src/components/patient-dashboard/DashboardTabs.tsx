
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Appointment } from '@/services/calendar/types';

interface DashboardTabsProps {
  initialTab: string;
  upcomingAppointments: Appointment[];
  onConfirmAppointment: (id: string) => void;
  onRescheduleAppointment: (id: string) => void;
  children?: React.ReactNode;
}

const DashboardTabs: React.FC<DashboardTabsProps> & {
  Content: typeof TabsContent;
} = ({
  initialTab,
  upcomingAppointments = [], // Provide default empty array
  onConfirmAppointment,
  onRescheduleAppointment,
  children
}) => {
  return (
    <Tabs defaultValue={initialTab} className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
      </TabsList>
      
      <TabsContent value="dashboard">
        {children}
      </TabsContent>
    </Tabs>
  );
};

// Attach the TabsContent component to DashboardTabs
DashboardTabs.Content = TabsContent;

export default DashboardTabs;
