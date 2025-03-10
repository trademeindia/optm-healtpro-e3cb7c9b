import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppointmentsList from '@/components/calendar/AppointmentsList';
import { UpcomingAppointment } from '@/hooks/calendar/useCalendarIntegration';

interface AppointmentsCardProps {
  isLoading: boolean;
  isAuthorized: boolean;
  appointments: UpcomingAppointment[];
}

const AppointmentsCard: React.FC<AppointmentsCardProps> = ({
  isLoading,
  isAuthorized,
  appointments
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
        <CardDescription>
          Your next scheduled appointments
        </CardDescription>
      </CardHeader>
      <CardContent>
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
