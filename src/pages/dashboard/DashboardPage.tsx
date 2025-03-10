
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Input } from '@/components/ui/input';
import DashboardHeader from './components/DashboardHeader';
import DashboardTabs from './components/DashboardTabs';
import DashboardDialog from './components/DashboardDialog';
import { useToast } from '@/hooks/use-toast';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const { toast } = useToast();

  // Functions for handling different dashboard actions
  const handleUploadDocument = () => {
    toast({
      title: "Document Uploaded",
      description: "Your document has been successfully uploaded.",
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
        variant: "destructive"
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
    });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Doctor Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage your clinic, appointments, and patient care
                </p>
              </div>
              
              <div className="flex items-center mt-4 md:mt-0 gap-2">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search patients, records..." 
                    className="pl-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  />
                </div>
                
                <DashboardHeader 
                  onUploadClick={() => setShowUploadDialog(true)} 
                />
              </div>
            </div>
            
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

// Dashboard data - moved to a separate file in real implementation
import { dashboardData } from './data/dashboardData';

export default Dashboard;
