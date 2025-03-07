
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import OverviewTabContent from '@/components/dashboard/OverviewTabContent';
import PatientsTabContent from '@/components/dashboard/PatientsTabContent';
import ReportsTabContent from '@/components/dashboard/ReportsTabContent';
import AnalyticsTabContent from '@/components/dashboard/AnalyticsTabContent';
import CalendarTabContent from '@/components/dashboard/CalendarTabContent';
import UploadDocumentDialog from '@/components/dashboard/UploadDocumentDialog';
import { useDashboardState } from '@/hooks/useDashboardState';

const Dashboard: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    showUploadDialog,
    setShowUploadDialog,
    currentDate,
    setCurrentDate,
    selectedPatient,
    appointments,
    therapySchedules,
    clinicMessages,
    clinicReminders,
    clinicDocuments,
    calendarEvents,
    patients,
    handleUploadDocument,
    handleViewAllAppointments,
    handleViewPatient,
    handleClosePatientHistory,
    handleUpdatePatient,
    handleViewAllMessages,
    handleViewAllDocuments,
    handleAddReminder,
    handleToggleReminder,
    handleViewFullCalendar
  } = useDashboardState();

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
          <div className="mb-6">
            <DashboardHeader onUploadClick={() => setShowUploadDialog(true)} />
            
            <DashboardTabs 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
            />
            
            <TabsContent value="overview" className="mt-0">
              <OverviewTabContent 
                appointments={appointments}
                therapySchedules={therapySchedules}
                clinicMessages={clinicMessages}
                clinicReminders={clinicReminders}
                clinicDocuments={clinicDocuments}
                calendarEvents={calendarEvents}
                currentDate={currentDate}
                onViewAllAppointments={handleViewAllAppointments}
                onViewPatient={handleViewPatient}
                onViewAllMessages={handleViewAllMessages}
                onAddReminder={handleAddReminder}
                onToggleReminder={handleToggleReminder}
                onUploadDocument={() => setShowUploadDialog(true)}
                onViewAllDocuments={handleViewAllDocuments}
                onDateChange={setCurrentDate}
                onViewFullCalendar={handleViewFullCalendar}
              />
            </TabsContent>
            
            <TabsContent value="patients" className="mt-0">
              <PatientsTabContent 
                selectedPatient={selectedPatient}
                patients={patients}
                onViewPatient={handleViewPatient}
                onClosePatientHistory={handleClosePatientHistory}
                onUpdatePatient={handleUpdatePatient}
              />
            </TabsContent>
            
            <TabsContent value="reports" className="mt-0">
              <ReportsTabContent 
                onUploadClick={() => setShowUploadDialog(true)} 
              />
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-0">
              <AnalyticsTabContent />
            </TabsContent>
            
            <TabsContent value="calendar" className="mt-0">
              <CalendarTabContent />
            </TabsContent>
          </div>
        </main>
      </div>
      
      <UploadDocumentDialog 
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        onUpload={handleUploadDocument}
      />
    </div>
  );
};

export default Dashboard;
