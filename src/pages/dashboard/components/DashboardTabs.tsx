
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AlertCircle } from 'lucide-react';
import { DashboardData } from '../types/dashboardTypes';
import OverviewTab from './tabs/OverviewTab';
import PatientsTab from './tabs/PatientsTab';
import ReportsTab from './tabs/ReportsTab';
import AnalyticsTab from './tabs/AnalyticsTab';
import CalendarTab from './tabs/CalendarTab';
import RemindersTab from './tabs/RemindersTab';
import { toast } from 'sonner';

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  selectedPatient: DashboardData['patients'][0] | null;
  handleClosePatientHistory: () => void;
  handleUpdatePatient: (patient: DashboardData['patients'][0]) => void;
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
  const [isRecovering, setIsRecovering] = useState(false);
  const [lastActiveTab, setLastActiveTab] = useState(activeTab);
  
  // Track last successful tab for recovery
  useEffect(() => {
    if (!isRecovering) {
      setLastActiveTab(activeTab);
    }
  }, [activeTab, isRecovering]);

  // Handle errors in tab switching
  const handleTabChange = (value: string) => {
    try {
      setActiveTab(value);
    } catch (error) {
      console.error("Error switching tabs:", error);
      setIsRecovering(true);
      
      // Fallback to previous tab if this one fails
      toast.error("Error loading tab", {
        description: "Returning to previous view",
        duration: 3000
      });
      
      // Try to recover by going back to last known good tab
      setTimeout(() => {
        setActiveTab(lastActiveTab);
        setIsRecovering(false);
      }, 500);
    }
  };

  const handleViewAllAppointments = () => {
    handleTabChange("calendar");
  };

  const handleViewAllMessages = () => {
    toast.info("Messages feature will be available soon", {
      duration: 3000
    });
  };

  const handleViewAllDocuments = () => {
    handleTabChange("reports");
  };

  const handleAddReminder = () => {
    handleTabChange("reminders");
  };

  const handleToggleReminder = (id: string) => {
    toast.success(`Reminder ${id} status toggled`, {
      duration: 2000
    });
  };

  const handleViewFullCalendar = () => {
    handleTabChange("calendar");
  };

  // Error boundary fallback
  if (!dashboardData) {
    return (
      <div className="p-6 bg-destructive/10 rounded-lg text-center">
        <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Dashboard data unavailable</h3>
        <p className="text-muted-foreground mb-4">
          We're having trouble loading the dashboard data. Please try refreshing the page.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <Tabs 
      defaultValue="overview" 
      value={activeTab} 
      onValueChange={handleTabChange}
      className="w-full"
    >
      <div className="overflow-x-auto sticky top-0 bg-white dark:bg-gray-800 z-10 pb-2 -mx-4 px-4">
        <TabsList className="mb-6 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 w-full flex flex-nowrap min-w-max">
          <TabsTrigger value="overview" className="rounded-md flex-1 whitespace-nowrap">
            Overview
          </TabsTrigger>
          <TabsTrigger value="patients" className="rounded-md flex-1 whitespace-nowrap">
            Patients
          </TabsTrigger>
          <TabsTrigger value="reports" className="rounded-md flex-1 whitespace-nowrap">
            <span className="hidden sm:inline">Reports & Documents</span>
            <span className="sm:hidden">Reports</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-md flex-1 whitespace-nowrap">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="calendar" className="rounded-md flex-1 whitespace-nowrap">
            Calendar
          </TabsTrigger>
          <TabsTrigger value="reminders" className="rounded-md flex-1 whitespace-nowrap">
            Reminders
          </TabsTrigger>
        </TabsList>
      </div>
      
      <div className="tab-content-container overflow-x-hidden">
        <TabsContent value="overview" className="mt-0">
          <OverviewTab 
            appointments={dashboardData.upcomingAppointments || []}
            therapySessions={dashboardData.therapySchedules || []}
            messages={dashboardData.clinicMessages || []}
            reminders={dashboardData.clinicReminders || []}
            documents={dashboardData.clinicDocuments || []}
            calendarEvents={dashboardData.calendarEvents || {}}
            currentDate={currentDate}
            onViewAllAppointments={handleViewAllAppointments}
            onViewPatient={handleViewPatient}
            onViewAllMessages={handleViewAllMessages}
            onAddReminder={handleAddReminder}
            onToggleReminder={handleToggleReminder}
            onViewFullCalendar={handleViewFullCalendar}
            onViewAllDocuments={handleViewAllDocuments}
            onUpload={() => handleTabChange("reports")}
          />
        </TabsContent>
        
        <TabsContent value="patients" className="mt-0">
          <PatientsTab />
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
        
        <TabsContent value="reminders" className="mt-0">
          <RemindersTab />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default DashboardTabs;
