import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import AppointmentsHeader from './components/AppointmentsHeader';
import AppointmentsList from './components/AppointmentsList';
import AppointmentsDashboard from '@/components/dashboard/AppointmentsDashboard';
import { useAppointments } from './hooks/useAppointments';
import NewAppointmentModal from './components/NewAppointmentModal';
import { useToast } from '@/hooks/use-toast';
import { Appointment } from '@/services/calendar/types';

const AppointmentsPage: React.FC = () => {
  const {
    appointments,
    isLoading,
    calendarConnected,
    loadAppointments,
    checkCalendarConnection,
    handleConfirmAppointment,
    handleRescheduleAppointment,
    handleConnectCalendar,
    handleCreateAppointment
  } = useAppointments();
  
  const { toast } = useToast();
  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] = useState(false);
  
  useEffect(() => {
    loadAppointments();
    checkCalendarConnection();
  }, []);
  
  const openNewAppointmentModal = () => {
    setIsNewAppointmentModalOpen(true);
  };
  
  const handleScheduleAppointment = async (appointmentData: any) => {
    try {
      await handleCreateAppointment(appointmentData);
      setIsNewAppointmentModalOpen(false);
      toast({
        title: "Appointment Scheduled",
        description: `Your appointment has been scheduled for ${appointmentData.date} at ${appointmentData.time}.`,
      });
    } catch (error) {
      console.error('Failed to schedule appointment:', error);
      toast({
        title: "Scheduling Failed",
        description: "There was a problem scheduling your appointment.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <AppointmentsHeader 
            isLoading={isLoading}
            calendarConnected={calendarConnected}
            onRefresh={loadAppointments}
            onConnectCalendar={handleConnectCalendar}
            onNewAppointment={openNewAppointmentModal}
          />
          
          <div className="max-w-7xl mx-auto">
            <AppointmentsDashboard 
              unreadMessages={3}
              nextAppointment={appointments.length > 0 ? {
                date: appointments[0].date,
                time: appointments[0].time,
                doctor: appointments[0].doctorName,
                type: appointments[0].type
              } : undefined}
            />
            
            <AppointmentsList 
              appointments={appointments}
              isLoading={isLoading}
              calendarConnected={calendarConnected}
              onConfirmAppointment={handleConfirmAppointment}
              onRescheduleAppointment={handleRescheduleAppointment}
              onCreateAppointment={openNewAppointmentModal}
            />
          </div>
        </main>
      </div>
      
      <NewAppointmentModal 
        isOpen={isNewAppointmentModalOpen}
        onClose={() => setIsNewAppointmentModalOpen(false)}
        onSchedule={handleScheduleAppointment}
      />
    </div>
  );
};

export default AppointmentsPage;
