import React from 'react';
import { toast } from 'sonner';
import UpcomingAppointments from '@/components/dashboard/UpcomingAppointments';
import TherapySchedules from '@/components/dashboard/TherapySchedules';
import ClinicMessages from '@/components/dashboard/ClinicMessages';
import ClinicDocuments from '@/components/dashboard/ClinicDocuments';
import ClinicReminders from '@/components/dashboard/ClinicReminders';
import MiniCalendar from '@/components/dashboard/MiniCalendar';
import AppointmentsDashboard from '@/components/dashboard/AppointmentsDashboard';
import { Card, CardContent } from '@/components/ui/card';

interface OverviewTabProps {
  appointments: any[];
  therapySessions: any[];
  messages: any[];
  reminders: any[];
  documents: any[];
  calendarEvents: any;
  currentDate: Date;
  onViewAllAppointments: () => void;
  onViewPatient: (patientId: number) => void;
  onViewAllMessages: () => void;
  onAddReminder: () => void;
  onToggleReminder: (id: string) => void;
  onViewFullCalendar: () => void;
  onViewAllDocuments: () => void;
  onUpload: () => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  appointments,
  therapySessions,
  messages,
  reminders,
  documents,
  calendarEvents,
  currentDate,
  onViewAllAppointments,
  onViewPatient,
  onViewAllMessages,
  onAddReminder,
  onToggleReminder,
  onViewFullCalendar,
  onViewAllDocuments,
  onUpload
}) => {
  const handleQuickAction = (action: string) => {
    toast.info(`${action} action initiated`, { duration: 3000 });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {["Add Patient", "Schedule", "Message", "Reports", "Analytics", "Help"].map((action) => (
          <Card 
            key={action} 
            className="border border-border/30 cursor-pointer transition-all hover:shadow-md hover:border-primary/30 hover:bg-primary/5"
            onClick={() => handleQuickAction(action)}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center text-center h-24">
              <div className="text-lg font-semibold">{action}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <AppointmentsDashboard />
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8">
          <UpcomingAppointments 
            appointments={appointments}
            onViewAll={onViewAllAppointments}
          />
        </div>
        
        <div className="md:col-span-4">
          <MiniCalendar 
            currentDate={currentDate} 
            events={calendarEvents}
            onDateChange={(date) => {}} // Handle date change
            onViewFullCalendar={onViewFullCalendar}
          />
        </div>
        
        <div className="md:col-span-4">
          <TherapySchedules 
            therapySessions={therapySessions}
            onViewPatient={onViewPatient}
          />
        </div>
        
        <div className="md:col-span-4">
          <ClinicMessages 
            messages={messages}
            onViewAll={onViewAllMessages}
          />
        </div>
        
        <div className="md:col-span-4">
          <ClinicReminders 
            reminders={reminders}
            onAddReminder={onAddReminder}
            onToggleReminder={onToggleReminder}
          />
        </div>
        
        <div className="md:col-span-12">
          <ClinicDocuments 
            documents={documents}
            onUpload={onUpload}
            onViewAll={onViewAllDocuments}
          />
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
