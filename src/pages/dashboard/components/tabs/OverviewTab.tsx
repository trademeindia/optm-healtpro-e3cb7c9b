
import React from 'react';
import UpcomingAppointments from '@/components/dashboard/UpcomingAppointments';
import TherapySchedules from '@/components/dashboard/TherapySchedules';
import ClinicMessages from '@/components/dashboard/ClinicMessages';
import ClinicDocuments from '@/components/dashboard/ClinicDocuments';
import ClinicReminders from '@/components/dashboard/ClinicReminders';
import MiniCalendar from '@/components/dashboard/MiniCalendar';

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
  return (
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
  );
};

export default OverviewTab;
