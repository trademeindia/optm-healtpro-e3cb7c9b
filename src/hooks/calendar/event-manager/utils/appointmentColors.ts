
import { appointmentTypes } from '@/components/calendar/appointments/appointmentConstants';

/**
 * Helper function to get color based on appointment type
 */
export const getAppointmentColor = (type: string): string => {
  switch (type) {
    case "New Appointment":
      return "#4285F4"; // Blue
    case "Check Up":
      return "#0F9D58"; // Green
    case "Review":
      return "#F4B400"; // Yellow
    case "Treatment":
      return "#DB4437"; // Red
    default:
      return "#4285F4"; // Default blue
  }
};
