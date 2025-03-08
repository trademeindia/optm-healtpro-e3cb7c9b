
import React from 'react';
import { Calendar, MessageCircle, Headset, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AppointmentsDashboardProps {
  className?: string;
  unreadMessages?: number;
  nextAppointment?: {
    date: string;
    time: string;
    doctor: string;
    type: string;
  };
}

const AppointmentsDashboard: React.FC<AppointmentsDashboardProps> = ({
  className,
  unreadMessages = 2,
  nextAppointment = {
    date: 'March 10, 2025',
    time: '10:30 AM',
    doctor: 'Dr. Nikolas Pascal',
    type: 'Follow-up Consultation'
  }
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("grid grid-cols-1 md:grid-cols-3 gap-6", className)}
    >
      {/* Upcoming Appointment Details */}
      <Card className="overflow-hidden border border-border/30 shadow-sm h-full">
        <CardHeader className="bg-primary/5 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Upcoming Appointment
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {nextAppointment ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-2xl font-semibold text-primary">{nextAppointment.date}</p>
                <p className="text-sm text-muted-foreground">{nextAppointment.time}</p>
              </div>
              <div className="pt-2 border-t border-border/50 space-y-1">
                <p className="font-medium">{nextAppointment.doctor}</p>
                <p className="text-sm text-muted-foreground">{nextAppointment.type}</p>
              </div>
              <Button className="w-full justify-between mt-4 group">
                View Schedule
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No upcoming appointments</p>
              <Button variant="outline" className="mt-4">Schedule Now</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Messages from Doctors */}
      <Card className="overflow-hidden border border-border/30 shadow-sm h-full">
        <CardHeader className="bg-primary/5 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              Doctor Messages
            </CardTitle>
            {unreadMessages > 0 && (
              <div className="bg-primary text-primary-foreground text-xs font-medium rounded-full h-6 min-w-6 flex items-center justify-center px-2">
                {unreadMessages}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-xl font-medium">
                You have {unreadMessages} unread {unreadMessages === 1 ? 'message' : 'messages'}
              </p>
              <p className="text-sm text-muted-foreground">
                Messages from your healthcare providers
              </p>
            </div>
            <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
              <p className="text-sm font-medium">Latest message:</p>
              <p className="text-sm text-muted-foreground mt-1">
                "Your recent test results are ready for review. Please check your patient portal..."
              </p>
            </div>
            <Button className="w-full justify-between mt-4 group">
              Check Messages
              <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Speak to a Specialist */}
      <Card className="overflow-hidden border border-border/30 shadow-sm h-full">
        <CardHeader className="bg-primary/5 pb-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Headset className="h-5 w-5 text-primary" />
            Speak to a Specialist
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 flex flex-col h-[calc(100%-64px)]">
          <div className="space-y-2 flex-1">
            <p className="text-xl font-medium">
              Get immediate assistance
            </p>
            <p className="text-sm text-muted-foreground">
              Connect with a healthcare specialist for real-time consultation
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="bg-primary/5 rounded-lg p-3 border border-primary/10 flex flex-col items-center justify-center text-center">
                <p className="text-sm font-medium">Available Now</p>
                <p className="text-xs text-muted-foreground">Wait time: ~2 min</p>
              </div>
              <div className="bg-primary/5 rounded-lg p-3 border border-primary/10 flex flex-col items-center justify-center text-center">
                <p className="text-sm font-medium">Specialists Online</p>
                <p className="text-xs text-muted-foreground">12 doctors</p>
              </div>
            </div>
          </div>
          <Button variant="default" size="lg" className="w-full mt-6 gap-2">
            <Headset className="h-4 w-4" />
            Start Chat
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AppointmentsDashboard;
