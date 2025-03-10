import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CalendarView from '@/components/calendar/CalendarView';
import ConnectCalendarCard from '@/components/calendar/ConnectCalendarCard';
import { CalendarEvent } from '@/hooks/calendar/useCalendarIntegration';

interface CalendarViewWrapperProps {
  isAuthorized: boolean;
  isLoading: boolean;
  selectedView: 'day' | 'week' | 'month';
  setSelectedView: (view: 'day' | 'week' | 'month') => void;
  calendarData: CalendarEvent[] | undefined;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onConnectCalendar: () => Promise<void>;
  isConnecting: boolean;
}

const CalendarViewWrapper: React.FC<CalendarViewWrapperProps> = ({
  isAuthorized,
  isLoading,
  selectedView,
  setSelectedView,
  calendarData,
  selectedDate,
  onDateSelect,
  onConnectCalendar,
  isConnecting
}) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Calendar</CardTitle>
          <div className="flex items-center gap-2">
            <Select 
              value={selectedView} 
              onValueChange={(value: 'day' | 'week' | 'month') => setSelectedView(value)}
              disabled={!isAuthorized}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <CardDescription>
          {isAuthorized ? 'Your schedule and appointments' : 'Connect your calendar to view appointments'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isAuthorized ? (
          <CalendarView 
            view={selectedView} 
            events={calendarData || []} 
            isLoading={isLoading} 
            selectedDate={selectedDate}
            onDateSelect={onDateSelect}
          />
        ) : (
          <ConnectCalendarCard
            isConnecting={isConnecting}
            onConnect={onConnectCalendar}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default CalendarViewWrapper;
