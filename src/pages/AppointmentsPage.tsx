
import React from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import usePatientDashboard from '@/hooks/usePatientDashboard';
import AppointmentsDashboard from '@/components/dashboard/AppointmentsDashboard';

const AppointmentsPage: React.FC = () => {
  const { user } = useAuth();
  const {
    upcomingAppointments,
    handleConfirmAppointment,
    handleRescheduleAppointment,
  } = usePatientDashboard();

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-6 pl-10 lg:pl-0">
            <h1 className="text-2xl font-bold">Appointments</h1>
            <p className="text-sm text-muted-foreground">
              Manage your upcoming appointments and schedule new ones
            </p>
          </div>
          
          <div className="max-w-7xl mx-auto">
            <AppointmentsDashboard 
              unreadMessages={3}
              nextAppointment={{
                date: 'June 20, 2023',
                time: '10:30 AM',
                doctor: 'Dr. Nikolas Pascal',
                type: 'Follow-up Consultation'
              }}
            />
            
            <h3 className="text-xl font-semibold mt-10 mb-4">Scheduled Appointments</h3>
            <div className="glass-morphism rounded-2xl p-6">
              <div className="space-y-4">
                {upcomingAppointments.map(appointment => (
                  <div key={appointment.id} className="p-4 border rounded-lg bg-card flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-base">{appointment.type}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {appointment.date} at {appointment.time}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {appointment.doctor}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 self-end md:self-center">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleConfirmAppointment(appointment.id)}
                      >
                        Confirm
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRescheduleAppointment(appointment.id)}
                      >
                        Reschedule
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="default" className="w-full mt-6">
                Schedule New Appointment
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppointmentsPage;
