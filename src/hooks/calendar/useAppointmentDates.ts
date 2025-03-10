
import { useState } from 'react';
import { parse, set } from 'date-fns';

export const useAppointmentDates = (initialDate: Date) => {
  const [date, setDate] = useState<Date>(initialDate);
  const [startTime, setStartTime] = useState<string>("9:00 AM");
  const [endTime, setEndTime] = useState<string>("9:30 AM");

  const parseTimeToDate = (baseDate: Date, timeString: string): Date => {
    try {
      const timeFormat = timeString.includes('AM') || timeString.includes('PM') ? 'h:mm a' : 'HH:mm';
      const parsed = parse(timeString, timeFormat, new Date());
      
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
  };

  const getAppointmentTimes = () => {
    const startDateTime = parseTimeToDate(date, startTime);
    const endDateTime = parseTimeToDate(date, endTime);
    
    return {
      start: startDateTime,
      end: endDateTime
    };
  };

  return {
    date,
    setDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    getAppointmentTimes
  };
};
