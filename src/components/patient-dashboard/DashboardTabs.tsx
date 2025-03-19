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
  upcomingAppointments = [],
  // Provide default empty array
  onConfirmAppointment,
  onRescheduleAppointment,
  children
}) => {
  return <Tabs defaultValue={initialTab} className="w-full">
      
      
      <TabsContent value="dashboard">
        {children}
      </TabsContent>
    </Tabs>;
};

// Attach the TabsContent component to DashboardTabs
DashboardTabs.Content = TabsContent;
export default DashboardTabs;