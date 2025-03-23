
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MessageSquare, HeartPulse, Pill } from 'lucide-react';
import { toast } from 'sonner';
import PatientAppointments from './PatientAppointments';
import SecureMessaging from './SecureMessaging';
import { useDoctors } from '@/hooks/patient-dashboard/useDoctors';
import { useAppointments } from '@/hooks/dashboard/useAppointments';
import { Appointment, AppointmentWithProvider } from '@/types/appointments';
import { ErrorBoundary } from '@/components/ui/error-boundary';

interface PatientDashboardTabsProps {
  initialTab?: string;
  upcomingAppointments?: AppointmentWithProvider[];
  onConfirmAppointment?: (appointmentId: string) => void;
  onRescheduleAppointment?: (appointmentId: string) => void;
  children?: React.ReactNode;
}

const PatientDashboardTabs: React.FC<PatientDashboardTabsProps> = ({
  initialTab = 'appointments',
  upcomingAppointments: providedAppointments,
  onConfirmAppointment: providedConfirmHandler,
  onRescheduleAppointment: providedRescheduleHandler,
  children
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const { doctors } = useDoctors();
  const { 
    upcomingAppointments: fetchedAppointments, 
    handleConfirmAppointment, 
    handleRescheduleAppointment 
  } = useAppointments();

  // Use provided appointments if available, otherwise use from hook
  const appointments = providedAppointments || 
    fetchedAppointments.map(appointment => ({
      id: appointment.id,
      patientId: appointment.patientId,
      providerId: appointment.providerId,
      date: appointment.date,
      time: appointment.time,
      status: appointment.status || 'scheduled',
      type: appointment.type,
      location: appointment.location,
      provider: appointment.provider || {
        id: appointment.providerId,
        name: appointment.doctor,
        specialty: 'General Medicine'
      }
    }));

  // Use provided handlers if available, otherwise use from hook
  const confirmAppointment = providedConfirmHandler || handleConfirmAppointment;
  const rescheduleAppointment = providedRescheduleHandler || handleRescheduleAppointment;

  const handleMessageDoctor = (doctorId: string, doctorName: string) => {
    setActiveTab('messages');
    toast.info(`Opening conversation with Dr. ${doctorName}`);
  };
  
  // Handle errors when loading sections
  const handleTabError = (error: Error) => {
    console.error("Error in tab content:", error);
    toast.error("Failed to load content", {
      description: "Please try again or contact support if the problem persists"
    });
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-4 mb-6">
        <TabsTrigger value="dashboard" className="flex items-center gap-2">
          <HeartPulse className="h-4 w-4" />
          <span className="hidden sm:inline">Dashboard</span>
        </TabsTrigger>
        <TabsTrigger value="appointments" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline">Appointments</span>
        </TabsTrigger>
        <TabsTrigger value="messages" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">Messages</span>
        </TabsTrigger>
        <TabsTrigger value="medications" className="flex items-center gap-2">
          <Pill className="h-4 w-4" />
          <span className="hidden sm:inline">Medications</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard" className="mt-0 space-y-6">
        <ErrorBoundary onError={handleTabError}>
          {children}
        </ErrorBoundary>
      </TabsContent>

      <TabsContent value="appointments" className="mt-0 space-y-6">
        <ErrorBoundary onError={handleTabError}>
          <PatientAppointments 
            appointments={appointments} 
            onMessageDoctor={handleMessageDoctor}
            onConfirmAppointment={confirmAppointment}
            onRescheduleAppointment={rescheduleAppointment}
          />
        </ErrorBoundary>
      </TabsContent>

      <TabsContent value="messages" className="mt-0 space-y-6">
        <ErrorBoundary onError={handleTabError}>
          <SecureMessaging doctors={doctors} />
        </ErrorBoundary>
      </TabsContent>

      <TabsContent value="medications" className="mt-0 space-y-6">
        <ErrorBoundary onError={handleTabError}>
          <div className="text-center py-12 border rounded-lg">
            <Pill className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium">Medication Management</h3>
            <p className="text-muted-foreground max-w-md mx-auto mt-2">
              Your medication schedules and history will be displayed here.
            </p>
          </div>
        </ErrorBoundary>
      </TabsContent>
    </Tabs>
  );
};

export default PatientDashboardTabs;
