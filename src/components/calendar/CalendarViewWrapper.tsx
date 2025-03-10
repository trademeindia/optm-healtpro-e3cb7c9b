
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ConnectCalendarCard from './ConnectCalendarCard';
import CalendarView from './CalendarView';
import { CalendarEvent } from '@/hooks/calendar/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CalendarViewWrapperProps {
  isAuthorized: boolean;
  isLoading: boolean;
  selectedView: 'day' | 'week' | 'month';
  setSelectedView: (view: 'day' | 'week' | 'month') => void;
  calendarData: CalendarEvent[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onConnectCalendar: () => Promise<void>;
  isConnecting: boolean;
  onEventsChange?: () => void;
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
  isConnecting,
  onEventsChange = () => {}
}) => {
  return (
    <div className="lg:col-span-2">
      <Card>
        <CardContent className="p-0 sm:p-6">
          {!isAuthorized ? (
            <ConnectCalendarCard
              onConnect={onConnectCalendar}
              isConnecting={isConnecting}
            />
          ) : (
            <div className="space-y-2">
              <Tabs value={selectedView} onValueChange={(v) => setSelectedView(v as 'day' | 'week' | 'month')}>
                <TabsList className="mb-4">
                  <TabsTrigger value="day">Day</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                </TabsList>
                
                <TabsContent value="day" className="mt-0">
                  <CalendarView
                    view="day"
                    events={calendarData}
                    isLoading={isLoading}
                    selectedDate={selectedDate}
                    onDateSelect={onDateSelect}
                    onEventsChange={onEventsChange}
                  />
                </TabsContent>
                
                <TabsContent value="week" className="mt-0">
                  <CalendarView
                    view="week"
                    events={calendarData}
                    isLoading={isLoading}
                    selectedDate={selectedDate}
                    onDateSelect={onDateSelect}
                    onEventsChange={onEventsChange}
                  />
                </TabsContent>
                
                <TabsContent value="month" className="mt-0">
                  <CalendarView
                    view="month"
                    events={calendarData}
                    isLoading={isLoading}
                    selectedDate={selectedDate}
                    onDateSelect={onDateSelect}
                    onEventsChange={onEventsChange}
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarViewWrapper;
