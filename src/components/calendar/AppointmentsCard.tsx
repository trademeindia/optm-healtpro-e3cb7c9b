
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppointmentsList from '@/components/calendar/AppointmentsList';
import { UpcomingAppointment } from '@/hooks/calendar/useCalendarIntegration';
import { Calendar, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

interface AppointmentsCardProps {
  isLoading: boolean;
  isAuthorized: boolean;
  appointments: UpcomingAppointment[];
  onRefresh?: () => Promise<void>;
}

const AppointmentsCard: React.FC<AppointmentsCardProps> = ({
  isLoading,
  isAuthorized,
  appointments,
  onRefresh
}) => {
  // Listen for calendar-updated events to refresh the appointments list
  useEffect(() => {
    const handleCalendarUpdate = () => {
      console.log("Calendar update detected in AppointmentsCard");
      if (onRefresh) onRefresh();
    };
    
    window.addEventListener('calendar-updated', handleCalendarUpdate);
    return () => {
      window.removeEventListener('calendar-updated', handleCalendarUpdate);
    };
  }, [onRefresh]);

  const handleManualRefresh = async () => {
    if (onRefresh) {
      await onRefresh();
    }
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-all duration-200 h-full overflow-hidden">
      <CardHeader className="pb-2 border-b border-border/20 flex flex-row justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-full">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription className="text-xs">
              Your next scheduled appointments
            </CardDescription>
          </div>
        </div>
        
        {isAuthorized && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleManualRefresh} 
            disabled={isLoading}
            className="h-8 px-2"
          >
            {isLoading ? (
              <Spinner size="sm" className="mr-1" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
            )}
            <span className="text-xs">Sync</span>
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-4 max-h-[calc(100vh-22rem)] overflow-y-auto">
        <AppointmentsList 
          appointments={appointments}
          isLoading={isLoading} 
          isAuthorized={isAuthorized}
        />
      </CardContent>
    </Card>
  );
};

export default AppointmentsCard;
