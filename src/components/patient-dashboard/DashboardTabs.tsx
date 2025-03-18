
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DashboardTabsProps {
  initialTab: string;
  upcomingAppointments: {
    id: string;
    date: string;
    time: string;
    doctor: string;
    type: string;
  }[];
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
      <TabsList className="mb-6 bg-secondary text-foreground">
        <TabsTrigger 
          value="dashboard" 
          className="px-4 py-2 text-foreground hover:text-primary data-[state=active]:bg-muted data-[state=active]:text-primary"
        >
          Dashboard
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="dashboard" className="text-foreground">
        {children}
      </TabsContent>
    </Tabs>
  );
};

// Attach the TabsContent component to DashboardTabs
DashboardTabs.Content = TabsContent;

export default DashboardTabs;
