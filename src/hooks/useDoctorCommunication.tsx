
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Appointment {
  id: string;
  date: string;
  time: string;
  doctor: string;
  type: string;
  isConfirmed?: boolean;
  isSyncedToCalendar?: boolean;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isFromDoctor: boolean;
}

export const useDoctorCommunication = () => {
  const { toast } = useToast();
  
  // Mock upcoming appointments
  const [upcomingAppointments] = useState<Appointment[]>([
    {
      id: '1',
      date: 'June 20, 2023',
      time: '10:30 AM',
      doctor: 'Dr. Nikolas Pascal',
      type: 'Follow-up',
      isConfirmed: false,
      isSyncedToCalendar: true
    },
    {
      id: '2',
      date: 'July 5, 2023',
      time: '02:00 PM',
      doctor: 'Dr. Nikolas Pascal',
      type: 'Physical Therapy',
      isConfirmed: true,
      isSyncedToCalendar: false
    }
  ]);

  // Mock doctor messages
  const [doctorMessages] = useState<Message[]>([
    {
      id: 'msg1',
      sender: 'Dr. Nikolas Pascal',
      content: "Hi Alex, I've reviewed your latest test results and would like to discuss them at our next appointment.",
      timestamp: '10:32 AM',
      isRead: false,
      isFromDoctor: true
    },
    {
      id: 'msg2',
      sender: 'Dr. Emma Rodriguez',
      content: "Your physical therapy exercises look good. Keep up with the daily routine we discussed.",
      timestamp: '9:15 AM',
      isRead: true,
      isFromDoctor: true
    },
    {
      id: 'msg3',
      sender: 'Nurse Sarah',
      content: 'Your prescription has been renewed and is ready for pickup at the pharmacy.',
      timestamp: 'Yesterday',
      isRead: true,
      isFromDoctor: true
    }
  ]);

  // Function to handle appointment confirmation
  const handleConfirmAppointment = (id: string) => {
    toast({
      title: "Appointment Confirmed",
      description: "Your appointment has been confirmed.",
    });
  };

  // Function to handle appointment rescheduling
  const handleRescheduleAppointment = (id: string) => {
    toast({
      title: "Reschedule Requested",
      description: "Your request to reschedule has been sent.",
    });
  };

  // Function to handle viewing all appointments
  const handleViewAllAppointments = () => {
    toast({
      title: "View Appointments",
      description: "Opening all appointments view.",
    });
  };

  // Function to handle message reading
  const handleReadMessage = (id: string) => {
    toast({
      title: "Message Opened",
      description: "Opening message details.",
    });
  };

  // Function to handle viewing all messages
  const handleViewAllMessages = () => {
    toast({
      title: "View Messages",
      description: "Opening all messages view.",
    });
  };

  return {
    appointments: upcomingAppointments,
    messages: doctorMessages,
    handlers: {
      confirmAppointment: handleConfirmAppointment,
      rescheduleAppointment: handleRescheduleAppointment,
      viewAllAppointments: handleViewAllAppointments,
      readMessage: handleReadMessage,
      viewAllMessages: handleViewAllMessages
    }
  };
};
