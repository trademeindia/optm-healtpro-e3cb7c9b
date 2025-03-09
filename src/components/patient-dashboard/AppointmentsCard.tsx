
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Appointment } from '@/services/calendar/types';

interface AppointmentsCardProps {
  upcomingAppointments: Appointment[];
  handleConfirmAppointment: (id: string) => void;
  handleRescheduleAppointment: (id: string) => void;
}

export const AppointmentsCard: React.FC<AppointmentsCardProps> = ({
  upcomingAppointments,
  handleConfirmAppointment,
  handleRescheduleAppointment
}) => {
  return (
    <Card className="col-span-1 lg:col-span-1">
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {upcomingAppointments.length > 0 ? (
          upcomingAppointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{appointment.type}</p>
                <p className="text-sm text-muted-foreground">
                  {appointment.date} at {appointment.time}
                </p>
              </div>
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleConfirmAppointment(appointment.id)}>
                  Confirm
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleRescheduleAppointment(appointment.id)}>
                  Reschedule
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground">No upcoming appointments scheduled.</p>
        )}
      </CardContent>
    </Card>
  );
};
