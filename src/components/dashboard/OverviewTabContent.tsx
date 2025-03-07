
import React from 'react';
import UpcomingAppointments from '@/components/dashboard/UpcomingAppointments';
import MiniCalendar from '@/components/dashboard/MiniCalendar';
import TherapySchedules from '@/components/dashboard/TherapySchedules';
import ClinicMessages from '@/components/dashboard/ClinicMessages';
import ClinicReminders from '@/components/dashboard/ClinicReminders';
import ClinicDocuments from '@/components/dashboard/ClinicDocuments';
import { 
  Appointment, 
  TherapySession, 
  ClinicMessage, 
  ClinicReminder, 
  ClinicDocument, 
  CalendarEvents 
} from '@/hooks/useDashboardState';

interface OverviewTabContentProps {
  appointments: Appointment[];
  therapySchedules: TherapySession[];
  clinicMessages: ClinicMessage[];
  clinicReminders: ClinicReminder[];
  clinicDocuments: ClinicDocument[];
  calendarEvents: CalendarEvents;
  currentDate: Date;
  onViewAllAppointments: () => void;
  onViewPatient: (patientId: number) => void;
  onViewAllMessages: () => void;
  onAddReminder: () => void;
  onToggleReminder: (id: string) => void;
  onUploadDocument: () => void;
  onViewAllDocuments: () => void;
  onDateChange: (date: Date) => void;
  onViewFullCalendar: () => void;
}

const OverviewTabContent: React.FC<OverviewTabContentProps> = ({
  appointments,
  therapySchedules,
  clinicMessages,
  clinicReminders,
  clinicDocuments,
  calendarEvents,
  currentDate,
  onViewAllAppointments,
  onViewPatient,
  onViewAllMessages,
  onAddReminder,
  onToggleReminder,
  onUploadDocument,
  onViewAllDocuments,
  onDateChange,
  onViewFullCalendar
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
          onDateChange={onDateChange}
          onViewFullCalendar={onViewFullCalendar}
        />
      </div>
      
      <div className="md:col-span-4">
        <TherapySchedules 
          therapySessions={therapySchedules}
          onViewPatient={onViewPatient}
        />
      </div>
      
      <div className="md:col-span-4">
        <ClinicMessages 
          messages={clinicMessages}
          onViewAll={onViewAllMessages}
        />
      </div>
      
      <div className="md:col-span-4">
        <ClinicReminders 
          reminders={clinicReminders}
          onAddReminder={onAddReminder}
          onToggleReminder={onToggleReminder}
        />
      </div>
      
      <div className="md:col-span-12">
        <ClinicDocuments 
          documents={clinicDocuments}
          onUpload={onUploadDocument}
          onViewAll={onViewAllDocuments}
        />
      </div>
    </div>
  );
};

export default OverviewTabContent;
