
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format, isToday, isTomorrow, addDays, isAfter, isBefore } from 'date-fns';
import { Calendar, Clock, MapPin, Check, CalendarDays, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { AppointmentWithProvider } from '@/types/appointments';

interface EnhancedAppointmentsListProps {
  appointments: AppointmentWithProvider[];
  onConfirm: (appointmentId: string) => void;
  onReschedule: (appointmentId: string) => void;
}

const EnhancedAppointmentsList: React.FC<EnhancedAppointmentsListProps> = ({
  appointments,
  onConfirm,
  onReschedule
}) => {
  // Sort appointments by date
  const sortedAppointments = [...appointments].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
  
  const getAppointmentDate = (dateString: string) => {
    const date = new Date(dateString);
    
    if (isToday(date)) {
      return 'Today';
    } else if (isTomorrow(date)) {
      return 'Tomorrow';
    } else if (isAfter(date, new Date()) && isBefore(date, addDays(new Date(), 7))) {
      return format(date, 'EEEE'); // Day of week
    } else {
      return format(date, 'MMM d, yyyy');
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  return (
    <Card className="shadow-md border-0">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
          <Button variant="ghost" size="sm" className="flex items-center text-xs text-primary">
            View all <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {sortedAppointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CalendarDays className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <h3 className="text-lg font-medium">No Upcoming Appointments</h3>
            <p className="text-sm text-muted-foreground mt-1">
              You don't have any scheduled appointments.
            </p>
          </div>
        ) : (
          <motion.div 
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {sortedAppointments.map((appointment) => {
              const appointmentDate = getAppointmentDate(appointment.date);
              const isActionable = appointment.status === 'scheduled';
              const doctor = appointment.provider ? appointment.provider.name : '';
              const specialty = appointment.provider ? appointment.provider.specialty : '';
              
              return (
                <motion.div 
                  key={appointment.id}
                  variants={itemVariants}
                  className="p-4 rounded-lg border bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start">
                    <div className="mr-4 p-3 rounded-full bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{appointment.type}</h4>
                          <p className="text-sm text-primary font-medium">{doctor}</p>
                          {specialty && (
                            <p className="text-xs text-muted-foreground">{specialty}</p>
                          )}
                        </div>
                        
                        <div className={`px-2 py-1 text-xs rounded-full ${
                          appointment.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                          appointment.status === 'scheduled' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          <span>{appointmentDate}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          <span>{appointment.location}</span>
                        </div>
                      </div>
                      
                      {isActionable && (
                        <div className="flex gap-2 mt-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs h-8"
                            onClick={() => onReschedule(appointment.id)}
                          >
                            Reschedule
                          </Button>
                          <Button 
                            size="sm" 
                            className="text-xs h-8 flex items-center"
                            onClick={() => onConfirm(appointment.id)}
                          >
                            <Check className="h-3.5 w-3.5 mr-1" />
                            Confirm
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedAppointmentsList;
