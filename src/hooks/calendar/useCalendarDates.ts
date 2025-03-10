
import { useState, useEffect } from 'react';

export interface CalendarDatesResult {
  visibleDates: Date[];
  visibleHours: number[];
  navigateToPrevious: () => void;
  navigateToNext: () => void;
  navigateToToday: () => void;
  isToday: (date: Date) => boolean;
}

export const useCalendarDates = (
  view: 'day' | 'week' | 'month',
  initialDate: Date,
  onDateSelect: (date: Date) => void
): CalendarDatesResult => {
  const [visibleDates, setVisibleDates] = useState<Date[]>([]);
  const [visibleHours, setVisibleHours] = useState<number[]>([]);
  const [selectedDate, setSelectedDateInternal] = useState<Date>(initialDate);

  // Update internal date when prop changes
  useEffect(() => {
    setSelectedDateInternal(initialDate);
  }, [initialDate]);

  // Calculate visible dates based on view and selected date
  useEffect(() => {
    const dates: Date[] = [];
    const today = new Date(selectedDate);
    
    if (view === 'day') {
      dates.push(today);
    } 
    else if (view === 'week') {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        dates.push(date);
      }
    } 
    else if (view === 'month') {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      const startDay = startOfMonth.getDay();
      for (let i = 0; i < startDay; i++) {
        const date = new Date(startOfMonth);
        date.setDate(date.getDate() - (startDay - i));
        dates.push(date);
      }
      
      for (let i = 1; i <= endOfMonth.getDate(); i++) {
        dates.push(new Date(today.getFullYear(), today.getMonth(), i));
      }
      
      const remainingDays = 42 - dates.length;
      for (let i = 1; i <= remainingDays; i++) {
        const date = new Date(endOfMonth);
        date.setDate(date.getDate() + i);
        dates.push(date);
      }
    }
    
    setVisibleDates(dates);
  }, [selectedDate, view]);

  // Set visible hours (8 AM to 6 PM by default)
  useEffect(() => {
    const hours = [];
    for (let hour = 8; hour <= 18; hour++) {
      hours.push(hour);
    }
    setVisibleHours(hours);
  }, []);

  const navigateToPrevious = () => {
    const newDate = new Date(selectedDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (view === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    onDateSelect(newDate);
  };

  const navigateToNext = () => {
    const newDate = new Date(selectedDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    onDateSelect(newDate);
  };

  const navigateToToday = () => {
    onDateSelect(new Date());
  };

  // Determine if a date is today
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  return {
    visibleDates,
    visibleHours,
    navigateToPrevious,
    navigateToNext,
    navigateToToday,
    isToday
  };
};
