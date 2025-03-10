
import React, { Suspense, lazy } from 'react';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import UpcomingAppointments from '@/components/dashboard/UpcomingAppointments';
import TherapySchedules from '@/components/dashboard/TherapySchedules';
import ClinicMessages from '@/components/dashboard/ClinicMessages';
import ClinicDocuments from '@/components/dashboard/ClinicDocuments';
import ClinicReminders from '@/components/dashboard/ClinicReminders';
import MiniCalendar from '@/components/dashboard/MiniCalendar';
import { AppointmentsDashboard } from '@/components/dashboard/appointments';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

// Use lazy loading for non-critical components
const LazyClinicDocuments = lazy(() => import('@/components/dashboard/ClinicDocuments'));

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

const ErrorFallback = ({ onRetry }: { onRetry: () => void }) => (
  <div className="p-6 bg-destructive/10 rounded-lg text-center">
    <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-3" />
    <h3 className="text-base font-medium mb-2">Failed to load data</h3>
    <p className="text-sm text-muted-foreground mb-3">
      There was a problem loading this section
    </p>
    <button 
      onClick={onRetry}
      className="px-3 py-1.5 bg-primary text-white text-sm rounded-md"
    >
      Retry
    </button>
  </div>
);

const LoadingFallback = () => (
  <div className="flex items-center justify-center p-8">
    <Spinner size="md" />
  </div>
);

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
  const handleQuickAction = (action: string) => {
    toast.info(`${action} action initiated`, { duration: 3000 });
  };

  const handleRetry = () => {
    window.location.reload();
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
          <ErrorBoundary fallback={<ErrorFallback onRetry={handleRetry} />}>
            <UpcomingAppointments 
              appointments={appointments}
              onViewAll={onViewAllAppointments}
            />
          </ErrorBoundary>
        </div>
        
        <div className="md:col-span-4">
          <ErrorBoundary fallback={<ErrorFallback onRetry={handleRetry} />}>
            <MiniCalendar 
              currentDate={currentDate} 
              events={calendarEvents}
              onDateChange={() => {}} // Handle date change
              onViewFullCalendar={onViewFullCalendar}
            />
          </ErrorBoundary>
        </div>
        
        <div className="md:col-span-4">
          <ErrorBoundary fallback={<ErrorFallback onRetry={handleRetry} />}>
            <TherapySchedules 
              therapySessions={therapySessions}
              onViewPatient={onViewPatient}
            />
          </ErrorBoundary>
        </div>
        
        <div className="md:col-span-4">
          <ErrorBoundary fallback={<ErrorFallback onRetry={handleRetry} />}>
            <ClinicMessages 
              messages={messages}
              onViewAll={onViewAllMessages}
            />
          </ErrorBoundary>
        </div>
        
        <div className="md:col-span-4">
          <ErrorBoundary fallback={<ErrorFallback onRetry={handleRetry} />}>
            <ClinicReminders 
              reminders={reminders}
              onAddReminder={onAddReminder}
              onToggleReminder={onToggleReminder}
            />
          </ErrorBoundary>
        </div>
        
        <div className="md:col-span-12">
          <Suspense fallback={<LoadingFallback />}>
            <LazyClinicDocuments 
              documents={documents}
              onUpload={onUpload}
              onViewAll={onViewAllDocuments}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

// Simple ErrorBoundary component
class ErrorBoundary extends React.Component<{
  children: React.ReactNode;
  fallback: React.ReactNode;
}> {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  componentDidCatch(error: any, info: any) {
    console.error("Error in component:", error, info);
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    
    return this.props.children;
  }
}

export default OverviewTab;
