
import React, { useState, useEffect, Suspense } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { useToast } from '@/hooks/use-toast';
import { dashboardData } from './data/dashboardData';
import DashboardTabs from './components/DashboardTabs';
import DashboardDialog from './components/DashboardDialog';
import ClinicAnalyticsGraph from '@/components/dashboard/ClinicAnalyticsGraph';
import DashboardHeader from './components/DashboardHeader';
import PeriodFilter from './components/PeriodFilter';
import KeyMetricsCards from './components/KeyMetricsCards';
import LegacyCharts from './components/LegacyCharts';
import { useAuth } from '@/contexts/auth';
import { useReminders } from '@/hooks/useReminders';
import ClinicReminders from '@/components/dashboard/ClinicReminders';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [filterPeriod, setFilterPeriod] = useState("thisWeek");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const { 
    reminders, 
    addReminder, 
    toggleReminder, 
    deleteReminder,
    getUpcomingReminders 
  } = useReminders();

  // Check user authentication status and set loading state
  useEffect(() => {
    if (user) {
      console.log(`Dashboard accessed by: ${user.name} (${user.role})`);
      // Simulate loading time for dashboard components
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      console.log('Dashboard accessed by unauthenticated user');
      setIsLoading(true);
    }
  }, [user]);

  // Functions for handling different dashboard actions
  const handleUploadDocument = () => {
    toast({
      title: "Document Uploaded",
      description: "Your document has been successfully uploaded.",
      duration: 3000,
    });
    setShowUploadDialog(false);
  };

  const handleViewPatient = (patientId: number) => {
    const patient = dashboardData.patients.find(p => p.id === patientId);
    if (patient) {
      setSelectedPatient(patient);
      toast({
        title: "Patient Selected",
        description: `Viewing details for ${patient.name}`,
        duration: 3000,
      });
    } else {
      toast({
        title: "Patient Not Found",
        description: "Could not find patient record.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const handleClosePatientHistory = () => {
    setSelectedPatient(null);
  };

  const handleUpdatePatient = (updatedPatient: any) => {
    toast({
      title: "Patient Updated",
      description: "Patient information has been updated successfully.",
      duration: 3000,
    });
  };

  const handleSaveReport = () => {
    toast({
      title: "Report Saved",
      description: "The report has been saved successfully.",
      duration: 3000,
    });
  };

  const handleAddReminder = (reminderData: Omit<{ id: string; title: string; dueDate: string; priority: 'low' | 'medium' | 'high'; completed: boolean; }, 'id'>) => {
    try {
      const newReminder = addReminder(reminderData);
      toast({
        title: "Reminder Added",
        description: `"${newReminder.title}" has been added to your reminders.`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Failed to add reminder:', error);
      toast({
        title: "Failed to Add Reminder",
        description: "There was an error adding your reminder. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full overflow-hidden">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background dashboard-container">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900 overflow-container">
          <div className="content-wrapper">
            {/* Dashboard Header */}
            <DashboardHeader doctorName={user?.name?.split(' ')[0] || "Doctor"} />
            
            {/* Filter Period Selector */}
            <div className="mb-6">
              <PeriodFilter 
                filterPeriod={filterPeriod} 
                setFilterPeriod={setFilterPeriod} 
              />
            </div>
            
            {/* Key Metrics Cards - Now in a more responsive grid */}
            <div className="mb-8">
              <KeyMetricsCards />
            </div>
            
            {/* Analytics Graph and Reminders Section */}
            <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <ClinicAnalyticsGraph />
              </div>
              
              <div>
                <ClinicReminders 
                  reminders={getUpcomingReminders().slice(0, 5)} 
                  onAddReminder={handleAddReminder}
                  onToggleReminder={toggleReminder}
                  onDeleteReminder={deleteReminder}
                />
              </div>
            </div>
            
            {/* Legacy Charts Section */}
            <div className="mb-8">
              <LegacyCharts handleSaveReport={handleSaveReport} />
            </div>
          
            {/* Tabs for detailed content */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6 mb-8 overflow-hidden">
              <DashboardTabs 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                selectedPatient={selectedPatient}
                handleClosePatientHistory={handleClosePatientHistory}
                handleUpdatePatient={handleUpdatePatient}
                handleViewPatient={handleViewPatient}
                dashboardData={dashboardData}
              />
            </div>
          </div>
        </main>
      </div>
      
      <DashboardDialog 
        showUploadDialog={showUploadDialog}
        setShowUploadDialog={setShowUploadDialog}
        handleUploadDocument={handleUploadDocument}
      />
    </div>
  );
};

export default Dashboard;
