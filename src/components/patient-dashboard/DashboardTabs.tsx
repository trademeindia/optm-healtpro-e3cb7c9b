
import React from 'react';
import { Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import AppointmentsDashboard from '@/components/dashboard/AppointmentsDashboard';
import PatientReports from '@/components/patient/PatientReports';
import SymptomProgressChart from '@/components/dashboard/SymptomProgressChart';

interface DashboardTabsProps {
  initialTab: string;
  upcomingAppointments: {
    id: string;
    date: string;
    time: string;
    doctor: string;
    type: string;
  }[];
  onConfirmAppointment: (id: string) => void;
  onRescheduleAppointment: (id: string) => void;
  children?: React.ReactNode;
}

const DashboardTabs: React.FC<DashboardTabsProps> & {
  Content: typeof TabsContent;
} = ({
  initialTab,
  upcomingAppointments = [], // Provide default empty array
  onConfirmAppointment,
  onRescheduleAppointment,
  children
}) => {
  return (
    <Tabs defaultValue={initialTab} className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="appointments">Appointments</TabsTrigger>
        <TabsTrigger value="progress">Progress</TabsTrigger>
        <TabsTrigger value="records">Medical Records</TabsTrigger>
      </TabsList>
      
      <TabsContent value="dashboard">
        {children}
      </TabsContent>
      
      <TabsContent value="appointments">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Your Appointments</h2>
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
              {upcomingAppointments && upcomingAppointments.length > 0 ? (
                upcomingAppointments.map(appointment => (
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
                        onClick={() => onConfirmAppointment(appointment.id)}
                      >
                        Confirm
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onRescheduleAppointment(appointment.id)}
                      >
                        Reschedule
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-6">
                  <p className="text-muted-foreground">No upcoming appointments scheduled</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="progress">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Your Progress</h2>
          <div className="glass-morphism rounded-2xl p-6">
            <SymptomProgressChart />
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="records">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Medical Records</h2>
          <div className="glass-morphism rounded-2xl p-6">
            <PatientReports />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

// Attach the TabsContent component to DashboardTabs
DashboardTabs.Content = TabsContent;

export default DashboardTabs;
