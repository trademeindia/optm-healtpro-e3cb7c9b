import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { format, parse, addMinutes } from 'date-fns';

export function useAppointmentDates(initialDate: Date = new Date()) {
  const [date, setDate] = useState<Date>(initialDate);
  const [startTime, setStartTime] = useState<string>('9:00 AM');
  const [endTime, setEndTime] = useState<string>('9:30 AM');

  // Update start and end times when date changes
  useEffect(() => {
    if (!date) return;
    
    // We keep the same times when date changes, just reset to current selected times
    setStartTime(startTime || '9:00 AM');
    setEndTime(endTime || '9:30 AM');
  }, [date]);

  // Format date for display
  const formatDate = useCallback((date: Date): string => {
    return format(date, 'PPP');
  }, []);

  // Parse time string to Date object
  const parseTime = useCallback((timeStr: string, dateVal: Date): Date => {
    try {
      const datePart = format(dateVal, 'yyyy-MM-dd');
      const parsedDate = parse(`${datePart} ${timeStr}`, 'yyyy-MM-dd h:mm a', new Date());
      console.log(`Parsed time ${timeStr} on ${datePart} to ${parsedDate.toISOString()}`);
      return parsedDate;
    } catch (error) {
      console.error('Error parsing time:', error);
      toast.error('Invalid time format');
      return new Date();
    }
  }, []);

  // Get appointment start and end times as Date objects
  const getAppointmentTimes = useCallback(() => {
    const start = parseTime(startTime, date);
    const end = parseTime(endTime, date);
    console.log(`Appointment times - Start: ${start.toISOString()}, End: ${end.toISOString()}`);
    return { start, end };
  }, [date, startTime, endTime, parseTime]);

  // Validate that start time is before end time
  const validateTimeRange = useCallback(() => {
    try {
      const { start, end } = getAppointmentTimes();
      
      if (start >= end) {
        return {
          isValid: false,
          errorMessage: 'End time must be after start time'
        };
      }
      
      // Check if the duration is reasonable (e.g., not more than 4 hours)
      const durationMs = end.getTime() - start.getTime();
      const durationHours = durationMs / (1000 * 60 * 60);
      
      if (durationHours > 4) {
        return {
          isValid: false,
          errorMessage: 'Appointment duration should not exceed 4 hours'
        };
      }
      
      return { isValid: true };
    } catch (error) {
      console.error('Error validating time range:', error);
      return {
        isValid: false,
        errorMessage: 'Invalid time format'
      };
    }
  }, [getAppointmentTimes]);

  // Auto-set end time based on start time (30 minutes later)
  const setAutoEndTime = useCallback(() => {
    try {
      const start = parseTime(startTime, date);
      const end = addMinutes(start, 30);
      const endTimeStr = format(end, 'h:mm a');
      
      // Only set if it's different to avoid loop
      if (endTimeStr !== endTime) {
        setEndTime(endTimeStr);
      }
    } catch (error) {
      console.error('Error setting auto end time:', error);
    }
  }, [date, startTime, endTime, parseTime]);

  return {
    date,
    setDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    formatDate,
    parseTime,
    getAppointmentTimes,
    validateTimeRange,
    setAutoEndTime
  };
}
