
import React from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import AppointmentsDashboard from '@/components/dashboard/AppointmentsDashboard';
import AddAppointmentDialog from '@/components/calendar/AddAppointmentDialog';
import AppointmentsHeader from '@/components/appointments/AppointmentsHeader';
import AppointmentsList from '@/components/appointments/AppointmentsList';
import { useAppointments } from '@/hooks/useAppointments';

const AppointmentsPage: React.FC = () => {
  const {
    appointments,
    isLoading,
    calendarConnected,
    addDialogOpen,
    setAddDialogOpen,
    loadAppointments,
    handleConfirmAppointment,
    handleRescheduleAppointment,
    handleConnectCalendar
  } = useAppointments();
  
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
            onAddAppointment={() => setAddDialogOpen(true)}
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
            
            <h3 className="text-xl font-semibold mt-10 mb-4">Scheduled Appointments</h3>
            <div className="glass-morphism rounded-2xl p-6">
              <AppointmentsList 
                appointments={appointments}
                isLoading={isLoading}
                calendarConnected={calendarConnected}
                onConfirmAppointment={handleConfirmAppointment}
                onRescheduleAppointment={handleRescheduleAppointment}
                onAddAppointment={() => setAddDialogOpen(true)}
              />
            </div>
          </div>
        </main>
      </div>
      
      <AddAppointmentDialog 
        open={addDialogOpen} 
        onOpenChange={setAddDialogOpen} 
        onAppointmentAdded={loadAppointments}
      />
    </div>
  );
};

export default AppointmentsPage;
