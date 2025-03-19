
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Calendar, User } from 'lucide-react';

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
        <TabsTrigger value="dashboard" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Dashboard
        </TabsTrigger>
        <TabsTrigger value="appointments" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Appointments
        </TabsTrigger>
        <TabsTrigger value="records" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Records
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="dashboard">
        {children}
      </TabsContent>
      
      <TabsContent value="appointments">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Your Appointments</h2>
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{appointment.type}</h3>
                      <p className="text-sm text-muted-foreground">
                        {appointment.date} at {appointment.time} with Dr. {appointment.doctor}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onConfirmAppointment(appointment.id)}
                        className="px-3 py-1 bg-primary text-white rounded-md text-sm"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => onRescheduleAppointment(appointment.id)}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                      >
                        Reschedule
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No upcoming appointments</p>
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="records">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Medical Records</h2>
          <p className="text-muted-foreground">
            View and manage your medical records, lab reports, and clinical documents.
          </p>
          <a 
            href="/patients/records" 
            className="inline-block px-4 py-2 bg-primary text-white rounded-md"
          >
            Manage Records
          </a>
        </div>
      </TabsContent>
    </Tabs>
  );
};

// Attach the TabsContent component to DashboardTabs
DashboardTabs.Content = TabsContent;
export default DashboardTabs;
