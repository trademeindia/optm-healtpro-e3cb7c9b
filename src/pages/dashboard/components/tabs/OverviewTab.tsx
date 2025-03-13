import React, { Suspense, lazy, useState } from 'react';
import { toast } from 'sonner';
import { AlertCircle, Plus, Calendar, MessageSquare, FileText, BarChart2, HelpCircle } from 'lucide-react';
import UpcomingAppointments from '@/components/dashboard/UpcomingAppointments';
import TherapySchedules from '@/components/dashboard/TherapySchedules';
import ClinicMessages from '@/components/dashboard/ClinicMessages';
import ClinicDocuments from '@/components/dashboard/ClinicDocuments';
import ClinicReminders from '@/components/dashboard/ClinicReminders';
import MiniCalendar from '@/components/dashboard/MiniCalendar';
import { AppointmentsDashboard } from '@/components/dashboard/appointments';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
  const [showAddPatientDialog, setShowAddPatientDialog] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [showAnalyticsDialog, setShowAnalyticsDialog] = useState(false);

  // Handler for quick action buttons
  const handleQuickAction = (action: string) => {
    switch(action) {
      case "Add Patient":
        toast.info("Opening add patient form", { duration: 3000 });
        setShowAddPatientDialog(true);
        break;
      case "Schedule":
        toast.info("Opening appointment scheduler", { duration: 3000 });
        onViewFullCalendar();
        break;
      case "Message":
        toast.info("Opening message center", { duration: 3000 });
        onViewAllMessages();
        break;
      case "Reports":
        toast.info("Opening reports center", { duration: 3000 });
        onViewAllDocuments();
        break;
      case "Analytics":
        toast.info("Opening analytics dashboard", { duration: 3000 });
        setShowAnalyticsDialog(true);
        break;
      case "Help":
        toast.info("Opening help center", { duration: 3000 });
        setShowHelpDialog(true);
        break;
      default:
        toast.info(`${action} action initiated`, { duration: 3000 });
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  // Define quick action icons
  const getActionIcon = (action: string) => {
    switch(action) {
      case "Add Patient": return <Plus className="h-5 w-5 text-primary" />;
      case "Schedule": return <Calendar className="h-5 w-5 text-primary" />;
      case "Message": return <MessageSquare className="h-5 w-5 text-primary" />;
      case "Reports": return <FileText className="h-5 w-5 text-primary" />;
      case "Analytics": return <BarChart2 className="h-5 w-5 text-primary" />;
      case "Help": return <HelpCircle className="h-5 w-5 text-primary" />;
      default: return null;
    }
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
              <div className="mb-2">{getActionIcon(action)}</div>
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

      <Dialog open={showAddPatientDialog} onOpenChange={setShowAddPatientDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Patient</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground mb-4">
              This is where you would add a new patient form. You can integrate with your existing patient registration system.
            </p>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">First Name</label>
                  <input className="w-full px-3 py-2 border rounded-md" placeholder="Enter first name" />
                </div>
                <div>
                  <label className="text-sm font-medium">Last Name</label>
                  <input className="w-full px-3 py-2 border rounded-md" placeholder="Enter last name" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <input className="w-full px-3 py-2 border rounded-md" placeholder="patient@example.com" type="email" />
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <input className="w-full px-3 py-2 border rounded-md" placeholder="(123) 456-7890" />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddPatientDialog(false)}>Cancel</Button>
              <Button onClick={() => {
                toast.success("Patient added successfully!");
                setShowAddPatientDialog(false);
              }}>Add Patient</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Help Center</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">Getting Started</h3>
                <p className="text-sm text-muted-foreground">Learn the basics of using the dashboard and managing your clinic.</p>
                <Button variant="link" className="px-0 text-primary">View Guide</Button>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">Patient Management</h3>
                <p className="text-sm text-muted-foreground">Learn how to add, edit, and manage patient records.</p>
                <Button variant="link" className="px-0 text-primary">View Guide</Button>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">Contact Support</h3>
                <p className="text-sm text-muted-foreground">Need more help? Our support team is available 24/7.</p>
                <Button variant="link" className="px-0 text-primary">Contact Support</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAnalyticsDialog} onOpenChange={setShowAnalyticsDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Clinic Analytics</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">Total Patients</p>
                    <p className="text-2xl font-bold mt-1">243</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">Appointments</p>
                    <p className="text-2xl font-bold mt-1">38</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-2xl font-bold mt-1">$5,230</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="text-sm font-medium mb-3">Monthly Patient Visits</h3>
                <div className="h-40 bg-muted rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Chart visualization would appear here</p>
                </div>
              </div>
              
              <Button 
                onClick={() => {
                  toast.info("Redirecting to full analytics dashboard");
                  setShowAnalyticsDialog(false);
                }}
                className="w-full"
              >
                View Full Analytics Dashboard
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
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
