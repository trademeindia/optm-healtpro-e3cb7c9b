
import React, { useState } from 'react';
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

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [filterPeriod, setFilterPeriod] = useState("thisWeek");
  const { toast } = useToast();

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

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900 overflow-container">
          <div className="content-wrapper">
            {/* Dashboard Header */}
            <DashboardHeader doctorName="Samantha" />
            
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
            
            {/* Analytics Graph Section */}
            <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <ClinicAnalyticsGraph />
            </div>
            
            {/* Legacy Charts Section */}
            <div className="mb-8">
              <LegacyCharts handleSaveReport={handleSaveReport} />
            </div>
          
            {/* Tabs for detailed content */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
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
