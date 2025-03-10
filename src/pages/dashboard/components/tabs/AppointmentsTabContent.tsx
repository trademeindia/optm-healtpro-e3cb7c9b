
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import CalendarViewWrapper from '@/components/calendar/CalendarViewWrapper';
import AppointmentsList from '@/components/calendar/AppointmentsList';
import { useCalendarIntegration } from '@/hooks/calendar/useCalendarIntegration';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AppointmentsTabContentProps {
  appointments: any[];
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}

const AppointmentsTabContent: React.FC<AppointmentsTabContentProps> = ({
  appointments,
  currentDate,
  setCurrentDate
}) => {
  const { 
    isLoading, 
    isAuthorized, 
    calendarData, 
    upcomingAppointments,
    authorizeCalendar, 
    selectedDate, 
    setSelectedDate, 
    refreshCalendar 
  } = useCalendarIntegration();

  const calendarViewRef = React.useRef(null);

  const handleCreateAppointment = () => {
    if (calendarViewRef.current) {
      calendarViewRef.current.openCreateDialog(selectedDate);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Appointments</h2>
        <Button onClick={handleCreateAppointment} disabled={!isAuthorized}>
          <Plus className="mr-2 h-4 w-4" />
          New Appointment
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <CalendarViewWrapper
          isAuthorized={isAuthorized}
          isLoading={isLoading}
          selectedView="week"
          setSelectedView={(view) => {}}
          calendarData={calendarData}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          onConnectCalendar={authorizeCalendar}
          isConnecting={isLoading}
          onEventsChange={refreshCalendar}
          calendarViewRef={calendarViewRef}
        />
        
        <div className="xl:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <AppointmentsList
                appointments={upcomingAppointments}
                isLoading={isLoading}
                isAuthorized={isAuthorized}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsTabContent;
