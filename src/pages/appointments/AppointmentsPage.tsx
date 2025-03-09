
import React, { useEffect } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import AppointmentsHeader from './components/AppointmentsHeader';
import AppointmentsList from './components/AppointmentsList';
import AppointmentsDashboard from '@/components/dashboard/AppointmentsDashboard';
import { useAppointments } from './hooks/useAppointments';

const AppointmentsPage: React.FC = () => {
  const {
    appointments,
    isLoading,
    calendarConnected,
    loadAppointments,
    checkCalendarConnection,
    handleConfirmAppointment,
    handleRescheduleAppointment,
    handleConnectCalendar
  } = useAppointments();
  
  useEffect(() => {
    loadAppointments();
    checkCalendarConnection();
  }, []);
  
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
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppointmentsPage;
