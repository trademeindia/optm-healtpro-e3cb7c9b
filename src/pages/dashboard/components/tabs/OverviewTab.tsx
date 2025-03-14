
import React, { useState } from 'react';
import { AppointmentsDashboard } from '@/components/dashboard/appointments';
import QuickActionsGrid from './overview/QuickActionsGrid';
import DashboardGrid from './overview/DashboardGrid';
import AddPatientDialog from './overview/AddPatientDialog';
import HelpDialog from './overview/HelpDialog';
import AnalyticsDialog from './overview/AnalyticsDialog';
import { toast } from 'sonner';

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
  appointments = [],
  therapySessions = [],
  messages = [],
  reminders = [],
  documents = [],
  calendarEvents = {},
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
  const [showAddPatientDialog, setShowAddPatientDialog] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [showAnalyticsDialog, setShowAnalyticsDialog] = useState(false);

  const handleAddPatient = (patient: any) => {
    toast.success("Patient added from Overview", {
      description: "Patient record created successfully",
      duration: 3000
    });
    setShowAddPatientDialog(false);
  };

  return (
    <div className="space-y-6">
      <QuickActionsGrid 
        onOpenAddPatientDialog={() => setShowAddPatientDialog(true)}
        onViewFullCalendar={onViewFullCalendar}
        onViewAllMessages={onViewAllMessages}
        onViewAllDocuments={onViewAllDocuments}
        onOpenAnalyticsDialog={() => setShowAnalyticsDialog(true)}
        onOpenHelpDialog={() => setShowHelpDialog(true)}
      />
      
      <AppointmentsDashboard />
      
      <DashboardGrid 
        appointments={appointments}
        therapySessions={therapySessions}
        messages={messages}
        reminders={reminders}
        documents={documents}
        calendarEvents={calendarEvents}
        currentDate={currentDate}
        onViewAllAppointments={onViewAllAppointments}
        onViewPatient={onViewPatient}
        onViewAllMessages={onViewAllMessages}
        onAddReminder={onAddReminder}
        onToggleReminder={onToggleReminder}
        onViewFullCalendar={onViewFullCalendar}
        onViewAllDocuments={onViewAllDocuments}
        onUpload={onUpload}
      />

      <AddPatientDialog 
        open={showAddPatientDialog} 
        onOpenChange={setShowAddPatientDialog}
        onAddPatient={handleAddPatient}
      />

      <HelpDialog 
        open={showHelpDialog} 
        onOpenChange={setShowHelpDialog} 
      />

      <AnalyticsDialog 
        open={showAnalyticsDialog} 
        onOpenChange={setShowAnalyticsDialog} 
      />
    </div>
  );
};

export default OverviewTab;
