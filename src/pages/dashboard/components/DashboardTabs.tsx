
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DashboardData } from '../types/dashboardTypes';
import OverviewTab from './tabs/OverviewTab';
import PatientsTab from './tabs/PatientsTab';
import ReportsTab from './tabs/ReportsTab';
import AnalyticsTab from './tabs/AnalyticsTab';
import CalendarTab from './tabs/CalendarTab';

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  selectedPatient: any;
  handleClosePatientHistory: () => void;
  handleUpdatePatient: (patient: any) => void;
  handleViewPatient: (patientId: number) => void;
  dashboardData: DashboardData;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({
  activeTab,
  setActiveTab,
  currentDate,
  setCurrentDate,
  selectedPatient,
  handleClosePatientHistory,
  handleUpdatePatient,
  handleViewPatient,
  dashboardData
}) => {
  const handleViewAllAppointments = () => {
    setActiveTab("calendar");
  };

  const handleViewAllMessages = () => {
    // Handle view all messages action
  };

  const handleViewAllDocuments = () => {
    // Handle view all documents action
  };

  const handleAddReminder = () => {
    // Handle add reminder action
  };

  const handleToggleReminder = (id: string) => {
    // Handle toggle reminder action
  };

  const handleViewFullCalendar = () => {
    setActiveTab("calendar");
  };

  return (
    <Tabs 
      defaultValue="overview" 
      value={activeTab} 
      onValueChange={setActiveTab}
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
      
      <TabsContent value="overview" className="mt-0">
        <OverviewTab 
          appointments={dashboardData.upcomingAppointments}
          therapySessions={dashboardData.therapySchedules}
          messages={dashboardData.clinicMessages}
          reminders={dashboardData.clinicReminders}
          documents={dashboardData.clinicDocuments}
          calendarEvents={dashboardData.calendarEvents}
          currentDate={currentDate}
          onViewAllAppointments={handleViewAllAppointments}
          onViewPatient={handleViewPatient}
          onViewAllMessages={handleViewAllMessages}
          onAddReminder={handleAddReminder}
          onToggleReminder={handleToggleReminder}
          onViewFullCalendar={handleViewFullCalendar}
          onViewAllDocuments={handleViewAllDocuments}
          onUpload={() => setActiveTab("reports")}
        />
      </TabsContent>
      
      <TabsContent value="patients" className="mt-0">
        <PatientsTab 
          patients={dashboardData.patients}
          selectedPatient={selectedPatient}
          onViewPatient={handleViewPatient}
          onClosePatientHistory={handleClosePatientHistory}
          onUpdatePatient={handleUpdatePatient}
        />
      </TabsContent>
      
      <TabsContent value="reports" className="mt-0">
        <ReportsTab />
      </TabsContent>
      
      <TabsContent value="analytics" className="mt-0">
        <AnalyticsTab />
      </TabsContent>
      
      <TabsContent value="calendar" className="mt-0">
        <CalendarTab />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
