
import React, { useState } from 'react';
import { Calendar, Clock, User, MapPin, AlertCircle, List, Clock3 } from 'lucide-react';
import { UpcomingAppointment } from '@/hooks/calendar/useCalendarIntegration';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { AppointmentStatusIndicator } from './AppointmentStatusIndicator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AppointmentsListProps {
  appointments: UpcomingAppointment[];
  isLoading: boolean;
  isAuthorized: boolean;
}

const AppointmentsList: React.FC<AppointmentsListProps> = ({ 
  appointments,
  isLoading,
  isAuthorized
}) => {
  const [activeTab, setActiveTab] = useState<string>("all");

  const handleViewDetails = (appointment: UpcomingAppointment) => {
    if (!appointment) return;
    toast.info(`Viewing details for ${appointment.title}`);
  };

  // Filter appointments based on active tab
  const getFilteredAppointments = () => {
    if (activeTab === "all") return appointments;
    return appointments.filter(appointment => appointment.status === activeTab);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2 items-center">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
              <div className="flex gap-2 items-center">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="text-center py-6 text-muted-foreground flex flex-col items-center gap-2">
        <AlertCircle className="h-5 w-5 text-muted-foreground mb-1" />
        Connect your calendar to view appointments
      </div>
    );
  }

  if (!appointments || appointments.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No upcoming appointments scheduled
      </div>
    );
  }

  const filteredAppointments = getFilteredAppointments();

  return (
    <div className="flex h-full">
      <Tabs orientation="vertical" defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="flex h-full w-full">
        <TabsList className="w-16 md:w-48 flex-shrink-0 flex flex-col items-stretch h-full border-r mr-4 pt-4 bg-muted/30">
          <TabsTrigger value="all" className="flex items-center justify-start gap-2 px-3 py-2 mb-1">
            <List className="h-4 w-4" />
            <span className="hidden md:inline">All</span>
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="flex items-center justify-start gap-2 px-3 py-2 mb-1">
            <Clock3 className="h-4 w-4" />
            <span className="hidden md:inline">Scheduled</span>
          </TabsTrigger>
          <TabsTrigger value="confirmed" className="flex items-center justify-start gap-2 px-3 py-2 mb-1">
            <Calendar className="h-4 w-4" />
            <span className="hidden md:inline">Confirmed</span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center justify-start gap-2 px-3 py-2 mb-1">
            <User className="h-4 w-4" />
            <span className="hidden md:inline">Completed</span>
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="flex items-center justify-start gap-2 px-3 py-2 mb-1">
            <AlertCircle className="h-4 w-4" />
            <span className="hidden md:inline">Cancelled</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="flex-1 pt-4">
          <div className="space-y-4">
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No {activeTab !== 'all' ? activeTab : ''} appointments found
              </div>
            ) : (
              filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{appointment.title}</h4>
                      {appointment.status && (
                        <AppointmentStatusIndicator status={appointment.status} />
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{appointment.type}</p>
                    
                    <div className="flex gap-2 items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{appointment.date}</span>
                    </div>
                    
                    <div className="flex gap-2 items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{appointment.time}</span>
                    </div>
                    
                    {appointment.patientName && (
                      <div className="flex gap-2 items-center text-sm text-muted-foreground">
                        <User className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{appointment.patientName}</span>
                      </div>
                    )}
                    
                    {appointment.location && (
                      <div className="flex gap-2 items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{appointment.location}</span>
                      </div>
                    )}
                    
                    <div className="pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleViewDetails(appointment)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppointmentsList;
