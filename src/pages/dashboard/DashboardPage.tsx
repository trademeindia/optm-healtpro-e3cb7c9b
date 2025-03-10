
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { useToast } from '@/hooks/use-toast';
import { dashboardData } from './data/dashboardData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  Book, 
  Users, 
  Settings 
} from 'lucide-react';
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
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            {/* Dashboard Header */}
            <DashboardHeader doctorName="Samantha" />
            
            {/* Main Dashboard with Vertical Tabs */}
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <Tabs 
                orientation="vertical" 
                defaultValue="overview" 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full flex"
              >
                <TabsList className="w-64 h-auto flex-shrink-0 flex flex-col items-stretch border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 py-4">
                  <TabsTrigger value="overview" className="justify-start gap-3 px-4 py-3 text-base text-left mb-1">
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Overview</span>
                  </TabsTrigger>
                  <TabsTrigger value="appointments" className="justify-start gap-3 px-4 py-3 text-base text-left mb-1">
                    <Calendar className="h-5 w-5" />
                    <span>Appointments</span>
                  </TabsTrigger>
                  <TabsTrigger value="reports" className="justify-start gap-3 px-4 py-3 text-base text-left mb-1">
                    <FileText className="h-5 w-5" />
                    <span>Medical Reports</span>
                  </TabsTrigger>
                  <TabsTrigger value="history" className="justify-start gap-3 px-4 py-3 text-base text-left mb-1">
                    <Book className="h-5 w-5" />
                    <span>Medical History</span>
                  </TabsTrigger>
                  <TabsTrigger value="doctors" className="justify-start gap-3 px-4 py-3 text-base text-left mb-1">
                    <Users className="h-5 w-5" />
                    <span>Doctors</span>
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="justify-start gap-3 px-4 py-3 text-base text-left mt-auto">
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex-1 p-6 overflow-auto">
                  <TabsContent value="overview" className="mt-0 h-full">
                    <OverviewTabContent 
                      dashboardData={dashboardData}
                      currentDate={currentDate}
                      handleViewPatient={handleViewPatient}
                      handleSaveReport={handleSaveReport}
                      filterPeriod={filterPeriod}
                      setFilterPeriod={setFilterPeriod}
                    />
                  </TabsContent>
                  
                  <TabsContent value="appointments" className="mt-0 h-full">
                    <AppointmentsTabContent 
                      appointments={dashboardData.upcomingAppointments || []}
                      currentDate={currentDate}
                      setCurrentDate={setCurrentDate}
                    />
                  </TabsContent>
                  
                  <TabsContent value="reports" className="mt-0 h-full">
                    <MedicalReportsTabContent 
                      reports={dashboardData.clinicDocuments || []}
                      onUpload={() => setShowUploadDialog(true)} 
                    />
                  </TabsContent>
                  
                  <TabsContent value="history" className="mt-0 h-full">
                    <MedicalHistoryTabContent 
                      patients={dashboardData.patients || []}
                      selectedPatient={selectedPatient}
                      onViewPatient={handleViewPatient}
                      onClosePatientHistory={handleClosePatientHistory}
                    />
                  </TabsContent>
                  
                  <TabsContent value="doctors" className="mt-0 h-full">
                    <DoctorsTabContent />
                  </TabsContent>
                  
                  <TabsContent value="settings" className="mt-0 h-full">
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
