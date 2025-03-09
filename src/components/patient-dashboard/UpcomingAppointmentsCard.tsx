
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import { Appointment } from '@/services/calendar/googleCalendarService';

interface UpcomingAppointmentsCardProps {
  appointments: Appointment[];
}

const UpcomingAppointmentsCard: React.FC<UpcomingAppointmentsCardProps> = ({ appointments }) => {
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
                <Button variant="outline" size="auto" className="text-xs sm:text-sm whitespace-nowrap">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingAppointmentsCard;
