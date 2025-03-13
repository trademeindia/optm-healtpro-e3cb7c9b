
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppointmentsList from '@/components/calendar/AppointmentsList';
import { UpcomingAppointment } from '@/hooks/calendar/useCalendarIntegration';
import { Calendar } from 'lucide-react';

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
    <Card className="shadow-sm hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-2 border-b border-border/20">
        <div className="flex items-center justify-between">
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
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-4">
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
