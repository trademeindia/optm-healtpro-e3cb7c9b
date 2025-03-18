import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DateTimePickerProps {
  date: Date;
  setDate: (date: Date) => void;
  className?: string;
}

// Generate time slots from 8 AM to 6 PM
const timeSlots = Array.from({ length: 21 }, (_, i) => {
  const hour = Math.floor(i / 2) + 8;
  const minute = (i % 2) * 30;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return {
    value: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
    label: `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`
  };
});

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  date,
  setDate,
  className,
}) => {
  const [selectedTime, setSelectedTime] = useState<string>(
    format(date, 'HH:mm')
  );

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    
    // Update the date with the selected time
    const [hours, minutes] = time.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes);
    setDate(newDate);
  };

  const handleDateChange = (newDate: Date | undefined) => {
    if (!newDate) return;
    
    // Keep the same time when date changes
    const [hours, minutes] = selectedTime.split(':').map(Number);
    newDate.setHours(hours, minutes);
    setDate(newDate);
  };

  return (
    <div className={cn("flex gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            initialFocus
            disabled={(date) => date < new Date()}
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>

      <Select value={selectedTime} onValueChange={handleTimeChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select time">
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              {selectedTime ? format(date, 'h:mm a') : 'Select time'}
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {timeSlots.map((slot) => (
            <SelectItem key={slot.value} value={slot.value}>
              {slot.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DateTimePicker;
