
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, MessageSquare, Calendar, Download } from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { dashboardData } from './data/dashboardData';
import DashboardTabs from './components/DashboardTabs';
import DashboardDialog from './components/DashboardDialog';

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
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Hi, Dr. Samantha. Welcome back to your clinic dashboard!
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
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      4
                    </span>
                  </Button>
                  
                  <Button variant="outline" size="icon" className="relative">
                    <MessageSquare className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      3
                    </span>
                  </Button>
                  
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="https://ui.shadcn.com/avatars/01.png" alt="User" />
                    <AvatarFallback>DR</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
            
            {/* Filter Period Selector */}
            <div className="flex justify-end mb-6">
              <Card className="border border-border/30">
                <CardContent className="p-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Filter Period:</span>
                  <Select defaultValue={filterPeriod} onValueChange={setFilterPeriod}>
                    <SelectTrigger className="h-8 w-auto min-w-32 border-none text-sm">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="thisWeek">This Week</SelectItem>
                      <SelectItem value="thisMonth">This Month</SelectItem>
                      <SelectItem value="lastMonth">Last Month</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>
            
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0 }}
              >
                <Card className="border border-border/30">
                  <CardContent className="p-4 flex items-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                      <Calendar className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold">75</h3>
                      <p className="text-muted-foreground text-sm">Total Appointments</p>
                      <p className="text-xs text-green-600 flex items-center">
                        <span className="mr-1">↑</span> 17% increase
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card className="border border-border/30">
                  <CardContent className="p-4 flex items-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <MessageSquare className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold">357</h3>
                      <p className="text-muted-foreground text-sm">Patients Treated</p>
                      <p className="text-xs text-blue-600 flex items-center">
                        <span className="mr-1">↑</span> 22% increase
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card className="border border-border/30">
                  <CardContent className="p-4 flex items-center">
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mr-4">
                      <Bell className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold">65</h3>
                      <p className="text-muted-foreground text-sm">Cancelled Sessions</p>
                      <p className="text-xs text-red-600 flex items-center">
                        <span className="mr-1">↑</span> 5% increase
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Card className="border border-border/30">
                  <CardContent className="p-4 flex items-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-green-600">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold">$128K</h3>
                      <p className="text-muted-foreground text-sm">Total Revenue</p>
                      <p className="text-xs text-green-600 flex items-center">
                        <span className="mr-1">↑</span> 12% increase
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            {/* Charts and Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <Card className="lg:col-span-2 border border-border/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Patient Activity</h3>
                    <Button variant="outline" size="sm" className="gap-1" onClick={handleSaveReport}>
                      <Download className="h-4 w-4" />
                      Save Report
                    </Button>
                  </div>
                  <div className="h-80">
                    {/* Chart would be rendered here - using a placeholder */}
                    <div className="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      <img 
                        src="/lovable-uploads/6a9055bf-3ecd-49e9-90dd-d04351aefca4.png" 
                        alt="Chart Preview" 
                        className="max-h-full object-contain opacity-20"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border border-border/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Patient Distribution</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="inline-block w-24 h-24 rounded-full border-8 border-red-500 relative">
                        <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">81%</span>
                      </div>
                      <p className="text-sm mt-2">Recurring</p>
                    </div>
                    <div className="text-center">
                      <div className="inline-block w-24 h-24 rounded-full border-8 border-emerald-300 relative">
                        <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">22%</span>
                      </div>
                      <p className="text-sm mt-2">New Patients</p>
                    </div>
                    <div className="text-center">
                      <div className="inline-block w-24 h-24 rounded-full border-8 border-blue-500 relative">
                        <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">62%</span>
                      </div>
                      <p className="text-sm mt-2">Referrals</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          
            {/* Tabs for detailed content */}
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

export default Dashboard;
