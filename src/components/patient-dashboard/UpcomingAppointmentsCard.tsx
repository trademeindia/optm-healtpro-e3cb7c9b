
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import { Appointment } from '@/services/calendar/types';

interface UpcomingAppointmentsCardProps {
  appointments: Appointment[];
  onConfirmAppointment?: (id: string) => void;
  onRescheduleAppointment?: (id: string) => void;
}

const UpcomingAppointmentsCard: React.FC<UpcomingAppointmentsCardProps> = ({ 
  appointments,
  onConfirmAppointment,
  onRescheduleAppointment
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          <span>Upcoming Appointments</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            <p>No upcoming appointments</p>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{appointment.type}</p>
                  <p className="text-sm text-muted-foreground">
                    {appointment.date} at {appointment.time}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Dr. {appointment.doctorName}
                  </p>
                </div>
                <div className="flex gap-2">
                  {onConfirmAppointment && (
                    <Button 
                      variant="outline" 
                      size="auto" 
                      className="text-xs sm:text-sm whitespace-nowrap"
                      onClick={() => onConfirmAppointment(appointment.id)}
                    >
                      Confirm
                    </Button>
                  )}
                  {onRescheduleAppointment && (
                    <Button 
                      variant="outline" 
                      size="auto" 
                      className="text-xs sm:text-sm whitespace-nowrap"
                      onClick={() => onRescheduleAppointment(appointment.id)}
                    >
                      Reschedule
                    </Button>
                  )}
                  {!onConfirmAppointment && !onRescheduleAppointment && (
                    <Button 
                      variant="outline" 
                      size="auto" 
                      className="text-xs sm:text-sm whitespace-nowrap"
                    >
                      View Details
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingAppointmentsCard;
