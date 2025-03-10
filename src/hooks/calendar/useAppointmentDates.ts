
import { useState, useCallback } from 'react';
import { parse, set, isValid, isBefore, addMinutes } from 'date-fns';

export const useAppointmentDates = (initialDate: Date) => {
  const [date, setDate] = useState<Date>(initialDate);
  const [startTime, setStartTime] = useState<string>("9:00 AM");
  const [endTime, setEndTime] = useState<string>("9:30 AM");

  const parseTimeToDate = useCallback((baseDate: Date, timeString: string): Date => {
    try {
      const timeFormat = timeString.includes('AM') || timeString.includes('PM') ? 'h:mm a' : 'HH:mm';
      const parsed = parse(timeString, timeFormat, new Date());
      
      if (!isValid(parsed)) {
        console.error("Invalid time format:", timeString);
        return baseDate;
      }
      
      return set(new Date(baseDate), {
        hours: parsed.getHours(),
        minutes: parsed.getMinutes(),
        seconds: 0,
        milliseconds: 0
      });
    } catch (error) {
      console.error("Error parsing time:", error);
      return baseDate;
    }
  }, []);

  const getAppointmentTimes = useCallback(() => {
    const startDateTime = parseTimeToDate(date, startTime);
    const endDateTime = parseTimeToDate(date, endTime);
    
    return {
      start: startDateTime,
      end: endDateTime
    };
  }, [date, startTime, endTime, parseTimeToDate]);

  const validateTimeRange = useCallback((): { isValid: boolean; errorMessage?: string } => {
    const { start, end } = getAppointmentTimes();
    
    if (isBefore(end, start) || end.getTime() === start.getTime()) {
      return { 
        isValid: false, 
        errorMessage: "End time must be after start time"
      };
    }
    
    const diff = (end.getTime() - start.getTime()) / (1000 * 60); // diff in minutes
    if (diff < 15) {
      return {
        isValid: false,
        errorMessage: "Appointment must be at least 15 minutes long"
      };
    }
    
    if (diff > 180) {
      return {
        isValid: false,
        errorMessage: "Appointment cannot exceed 3 hours"
      };
    }
    
    return { isValid: true };
  }, [getAppointmentTimes]);

  const setAutoEndTime = useCallback(() => {
    // Automatically set end time to 30 minutes after start time
    const startDateTime = parseTimeToDate(date, startTime);
    const suggestedEndTime = addMinutes(startDateTime, 30);
    
    // Format the time back to a string
    const hours = suggestedEndTime.getHours();
    const minutes = suggestedEndTime.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
    setEndTime(`${formattedHours}:${formattedMinutes} ${period}`);
  }, [date, startTime, parseTimeToDate]);

  return {
    date,
    setDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    getAppointmentTimes,
    validateTimeRange,
    setAutoEndTime
  };
};
