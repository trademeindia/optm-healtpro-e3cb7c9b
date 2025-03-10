
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { useToast } from '@/hooks/use-toast';
import { dashboardData } from './data/dashboardData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, Calendar, FileText, Book, Users, Settings } from 'lucide-react';
import DashboardHeader from './components/DashboardHeader';
import OverviewTabContent from './components/tabs/OverviewTabContent';
import AppointmentsTabContent from './components/tabs/AppointmentsTabContent';
import MedicalReportsTabContent from './components/tabs/MedicalReportsTabContent';
import MedicalHistoryTabContent from './components/tabs/MedicalHistoryTabContent';
import DoctorsTabContent from './components/tabs/DoctorsTabContent';
import SettingsTabContent from './components/tabs/SettingsTabContent';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [filterPeriod, setFilterPeriod] = useState("thisWeek");
  const { toast } = useToast();

  const handleUploadDocument = () => {
    toast({
      title: "Document Uploaded",
      description: "Your document has been successfully uploaded.",
      duration: 3000
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
        duration: 5000
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
      duration: 3000
    });
  };

  const handleSaveReport = () => {
    toast({
      title: "Report Saved",
      description: "The report has been saved successfully.",
      duration: 3000
    });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto space-y-6">
            <DashboardHeader doctorName="Samantha" />
            
            <div className="dashboard-tabs bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <TabsList className="dashboard-tabs-list p-2 bg-gray-50 dark:bg-gray-900 flex flex-wrap gap-1 justify-start">
                    <TabsTrigger value="overview" className="dashboard-tab-trigger">
                      <LayoutDashboard className="h-4 w-4" />
                      <span className="hidden sm:inline">Overview</span>
                    </TabsTrigger>
                    <TabsTrigger value="appointments" className="dashboard-tab-trigger">
                      <Calendar className="h-4 w-4" />
                      <span className="hidden sm:inline">Appointments</span>
                    </TabsTrigger>
                    <TabsTrigger value="reports" className="dashboard-tab-trigger">
                      <FileText className="h-4 w-4" />
                      <span className="hidden sm:inline">Reports</span>
                    </TabsTrigger>
                    <TabsTrigger value="history" className="dashboard-tab-trigger">
                      <Book className="h-4 w-4" />
                      <span className="hidden sm:inline">History</span>
                    </TabsTrigger>
                    <TabsTrigger value="doctors" className="dashboard-tab-trigger">
                      <Users className="h-4 w-4" />
                      <span className="hidden sm:inline">Doctors</span>
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="dashboard-tab-trigger">
                      <Settings className="h-4 w-4" />
                      <span className="hidden sm:inline">Settings</span>
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <div className="dashboard-tab-content">
                  <TabsContent value="overview" className="mt-0 focus-visible:outline-none">
                    <OverviewTabContent 
                      dashboardData={dashboardData} 
                      currentDate={currentDate} 
                      handleViewPatient={handleViewPatient}
                      handleSaveReport={handleSaveReport}
                      filterPeriod={filterPeriod}
                      setFilterPeriod={setFilterPeriod}
                    />
                  </TabsContent>
                  
                  <TabsContent value="appointments" className="mt-0 focus-visible:outline-none">
                    <AppointmentsTabContent 
                      appointments={dashboardData.upcomingAppointments || []}
                      currentDate={currentDate}
                      setCurrentDate={setCurrentDate}
                    />
                  </TabsContent>
                  
                  <TabsContent value="reports" className="mt-0 focus-visible:outline-none">
                    <MedicalReportsTabContent 
                      reports={dashboardData.clinicDocuments || []}
                      onUpload={() => setShowUploadDialog(true)}
                    />
                  </TabsContent>
                  
                  <TabsContent value="history" className="mt-0 focus-visible:outline-none">
                    <MedicalHistoryTabContent 
                      patients={dashboardData.patients || []}
                      selectedPatient={selectedPatient}
                      onViewPatient={handleViewPatient}
                      onClosePatientHistory={handleClosePatientHistory}
                    />
                  </TabsContent>
                  
                  <TabsContent value="doctors" className="mt-0 focus-visible:outline-none">
                    <DoctorsTabContent />
                  </TabsContent>
                  
                  <TabsContent value="settings" className="mt-0 focus-visible:outline-none">
                    <SettingsTabContent />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
