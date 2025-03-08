
import React from 'react';
import { Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

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
  upcomingAppointments,
  onConfirmAppointment,
  onRescheduleAppointment,
  children
}) => {
  return (
    <Tabs defaultValue={initialTab} className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="appointments">Appointments</TabsTrigger>
      </TabsList>
      
      <TabsContent value="dashboard">
        {children}
      </TabsContent>
      
      <TabsContent value="appointments">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Your Appointments</h2>
          
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
              ))}
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

// Attach the TabsContent component to DashboardTabs
DashboardTabs.Content = TabsContent;

export default DashboardTabs;
