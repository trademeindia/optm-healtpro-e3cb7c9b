
import { useState, useCallback } from 'react';
import { parse, set, isValid, isBefore, addMinutes, format } from 'date-fns';

export const useAppointmentDates = (initialDate: Date) => {
  const [date, setDate] = useState<Date>(initialDate);
  const [startTime, setStartTime] = useState<string>("9:00 AM");
  const [endTime, setEndTime] = useState<string>("9:30 AM");

  const parseTimeToDate = useCallback((baseDate: Date, timeString: string): Date => {
    try {
      // Handle different time formats (12h or 24h)
      const timeFormat = timeString.includes('AM') || timeString.includes('PM') ? 'h:mm a' : 'HH:mm';
      
      // Parse the time string into a Date object
      const parsed = parse(timeString, timeFormat, new Date());
      
      if (!isValid(parsed)) {
        console.error("Invalid time format:", timeString);
        return baseDate;
      }
      
      // Create a new Date by combining the base date with the parsed time
      const result = set(new Date(baseDate), {
        hours: parsed.getHours(),
        minutes: parsed.getMinutes(),
        seconds: 0,
        milliseconds: 0
      });
      
      console.log(`Parsed time ${timeString} on ${format(baseDate, 'yyyy-MM-dd')} to ${result.toISOString()}`);
      return result;
    } catch (error) {
      console.error("Error parsing time:", error);
      return baseDate;
    }
  }, []);

  const getAppointmentTimes = useCallback(() => {
    // Make sure we have a valid date
    const baseDate = isValid(date) ? date : new Date();
    
    const startDateTime = parseTimeToDate(baseDate, startTime);
    const endDateTime = parseTimeToDate(baseDate, endTime);
    
    console.log(`Appointment times - Start: ${startDateTime.toISOString()}, End: ${endDateTime.toISOString()}`);
    
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
    
    const newEndTime = `${formattedHours}:${formattedMinutes} ${period}`;
    console.log(`Auto-setting end time to ${newEndTime} based on start time ${startTime}`);
    setEndTime(newEndTime);
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
