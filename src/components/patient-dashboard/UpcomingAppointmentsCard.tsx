
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, isValid, parseISO } from 'date-fns';

interface Appointment {
  id: string;
  type: string;
  date: string;
  time: string;
  location: string;
  status: string;
  doctor?: string;
  provider?: {
    id: string;
    name: string;
    specialty: string;
  };
}

interface UpcomingAppointmentsCardProps {
  appointments: Appointment[];
  onViewAll?: () => void;
}

const UpcomingAppointmentsCard: React.FC<UpcomingAppointmentsCardProps> = ({
  appointments,
  onViewAll
}) => {
  const formatAppointmentDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) return 'Invalid date';
      return format(date, 'EEE, MMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Upcoming Appointments
        </CardTitle>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No upcoming appointments</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.slice(0, 3).map((appointment) => (
              <div 
                key={appointment.id}
                className="flex items-start gap-3 border-b border-gray-100 pb-3 last:border-0 last:pb-0"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <h4 className="font-medium text-sm">{appointment.type}</h4>
                    <Badge 
                      variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {appointment.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatAppointmentDate(appointment.date)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{appointment.time}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span>
                      {appointment.provider 
                        ? `Dr. ${appointment.provider.name} (${appointment.provider.specialty})` 
                        : appointment.doctor || 'Unknown Doctor'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {appointments.length > 3 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-2"
                onClick={onViewAll}
              >
                View All Appointments
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingAppointmentsCard;
