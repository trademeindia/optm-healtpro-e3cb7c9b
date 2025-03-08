
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PatientReports from '@/components/patient/PatientReports';
import SymptomProgressChart from '@/components/dashboard/SymptomProgressChart';

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
      <TabsList className="mb-6">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="progress">Progress</TabsTrigger>
        <TabsTrigger value="records">Medical Records</TabsTrigger>
      </TabsList>
      
      <TabsContent value="dashboard">
        {children}
      </TabsContent>
      
      <TabsContent value="progress">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Your Progress</h2>
          <div className="glass-morphism rounded-2xl p-6">
            <SymptomProgressChart />
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="records">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Medical Records</h2>
          <div className="glass-morphism rounded-2xl p-6">
            <PatientReports />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

// Attach the TabsContent component to DashboardTabs
DashboardTabs.Content = TabsContent;

export default DashboardTabs;
