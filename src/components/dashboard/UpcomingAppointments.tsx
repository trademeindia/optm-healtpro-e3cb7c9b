
import React from 'react';
import { Calendar, Clock, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Appointment {
  id: string;
  patientName: string;
  patientId: number;
  time: string;
  date: string;
  type: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
}

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
  className?: string;
  onViewAll?: () => void;
}

const UpcomingAppointments: React.FC<UpcomingAppointmentsProps> = ({
  appointments,
  className,
  onViewAll,
}) => {
  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300';
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300';
    }
  };

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle className="text-xl">Upcoming Appointments</CardTitle>
        <CardDescription>
          Patient appointments scheduled for the coming days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">No upcoming appointments</p>
          ) : (
            appointments.slice(0, 5).map((appointment) => (
              <div key={appointment.id} className="flex items-start gap-4 border-b border-gray-100 dark:border-gray-800 pb-4 last:border-0 last:pb-0">
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{appointment.patientName}</p>
                  <p className="text-sm text-muted-foreground">{appointment.type}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="mr-1 h-3 w-3" />
                      {appointment.date}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      {appointment.time}
                    </div>
                  </div>
                </div>
                <div className={cn("text-xs px-2 py-1 rounded-full font-medium", getStatusColor(appointment.status))}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </div>
              </div>
            ))
          )}
        </div>
        
        {appointments.length > 5 && (
          <Button variant="ghost" className="w-full mt-4" onClick={onViewAll}>
            View All Appointments
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingAppointments;
