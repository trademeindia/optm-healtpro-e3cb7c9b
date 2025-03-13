
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppointmentsList from '@/components/calendar/AppointmentsList';
import { UpcomingAppointment } from '@/hooks/calendar/useCalendarIntegration';
import { Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AppointmentsCardProps {
  isLoading: boolean;
  isAuthorized: boolean;
  appointments: UpcomingAppointment[];
  onRefresh?: () => Promise<void>;
  publicCalendarUrl?: string;
}

const AppointmentsCard: React.FC<AppointmentsCardProps> = ({
  isLoading,
  isAuthorized,
  appointments,
  onRefresh,
  publicCalendarUrl
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Listen for calendar-updated events to refresh the appointments list automatically
  useEffect(() => {
    const handleCalendarUpdate = () => {
      console.log("Calendar update detected in AppointmentsCard");
      if (onRefresh) onRefresh();
      
      // Reload the iframe to show the latest changes
      if (iframeRef.current) {
        console.log("Reloading calendar iframe after appointment update");
        const currentSrc = iframeRef.current.src;
        // Force a reload by clearing and resetting the src
        iframeRef.current.src = '';
        setTimeout(() => {
          if (iframeRef.current) {
            iframeRef.current.src = currentSrc;
          }
        }, 100);
      }
    };

    // Listen for all appointment-related events to trigger automatic refresh
    window.addEventListener('calendar-updated', handleCalendarUpdate);
    window.addEventListener('appointment-created', handleCalendarUpdate);
    window.addEventListener('appointment-updated', handleCalendarUpdate);
    window.addEventListener('appointment-deleted', handleCalendarUpdate);
    
    return () => {
      window.removeEventListener('calendar-updated', handleCalendarUpdate);
      window.removeEventListener('appointment-created', handleCalendarUpdate);
      window.removeEventListener('appointment-updated', handleCalendarUpdate);
      window.removeEventListener('appointment-deleted', handleCalendarUpdate);
    };
  }, [onRefresh]);

  return (
    <Card className="shadow-sm hover:shadow-md transition-all duration-200 h-full overflow-hidden">
      <CardHeader className="pb-2 border-b border-border/20 flex flex-row justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-full">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>Calendar</CardTitle>
            <CardDescription className="text-xs">
              Your appointment schedule
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <Tabs defaultValue="calendar" className="w-full">
        <div className="px-4 pt-2">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="calendar">Google Calendar</TabsTrigger>
            <TabsTrigger value="list">Appointments List</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="calendar" className="m-0">
          <CardContent className="p-0 h-[calc(100vh-22rem)]">
            {isAuthorized && publicCalendarUrl ? (
              <iframe 
                ref={iframeRef}
                src={publicCalendarUrl}
                style={{ border: 0 }}
                width="100%" 
                height="100%" 
                frameBorder="0" 
                scrolling="no"
                title="Google Calendar"
                onLoad={() => console.log("Calendar iframe loaded successfully")}
                onError={() => console.error("Error loading calendar iframe")}
              ></iframe>
            ) : (
              <div className="flex items-center justify-center h-full p-4 text-center text-muted-foreground">
                {isAuthorized 
                  ? "Calendar URL not available. Please connect your Google Calendar."
                  : "Please connect your Google Calendar to view your schedule."}
              </div>
            )}
          </CardContent>
        </TabsContent>
        
        <TabsContent value="list" className="m-0">
          <CardContent className="p-4 pt-4 max-h-[calc(100vh-22rem)] overflow-y-auto">
            <AppointmentsList 
              appointments={appointments} 
              isLoading={isLoading} 
              isAuthorized={isAuthorized} 
            />
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AppointmentsCard;
