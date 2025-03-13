
import React, { forwardRef, useEffect, useRef } from 'react';
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
  calendarViewRef?: React.RefObject<any>;
  publicCalendarUrl?: string;
  reloadCalendarIframe?: () => void;
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
  onEventsChange = () => {},
  calendarViewRef,
  publicCalendarUrl,
  reloadCalendarIframe
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Setup a function to reload the iframe when needed
  const reloadIframe = () => {
    if (iframeRef.current) {
      console.log("Reloading Google Calendar iframe directly");
      const src = iframeRef.current.src;
      iframeRef.current.src = '';
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = src;
        }
      }, 100);
    } else if (reloadCalendarIframe) {
      reloadCalendarIframe();
    }
  };

  // Add event listener for calendar changes
  useEffect(() => {
    if (isAuthorized && publicCalendarUrl) {
      // Add event listener for custom reload events
      const handleCalendarUpdate = () => {
        console.log("Calendar update event received, reloading iframe");
        reloadIframe();
      };
      window.addEventListener('calendar-updated', handleCalendarUpdate);
      return () => {
        window.removeEventListener('calendar-updated', handleCalendarUpdate);
      };
    }
  }, [isAuthorized, publicCalendarUrl]);

  return (
    <div className="flex flex-col space-y-6">
      {!isAuthorized ? (
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <ConnectCalendarCard 
              onConnectCalendar={onConnectCalendar}
              isConnecting={isConnecting}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="shadow-sm overflow-hidden">
            <Tabs value={selectedView} onValueChange={(value) => setSelectedView(value as any)}>
              <div className="bg-muted/30 border-b px-4 py-2">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Calendar</h2>
                  <TabsList className="bg-background/50">
                    <TabsTrigger value="day">Day</TabsTrigger>
                    <TabsTrigger value="week">Week</TabsTrigger>
                    <TabsTrigger value="month">Month</TabsTrigger>
                  </TabsList>
                </div>
              </div>
              
              <CardContent className="p-0">
                <TabsContent value="day" className="m-0">
                  <CalendarView
                    ref={calendarViewRef}
                    view="day"
                    events={calendarData}
                    selectedDate={selectedDate}
                    onDateSelect={onDateSelect}
                    onEventChange={onEventsChange}
                  />
                </TabsContent>
                
                <TabsContent value="week" className="m-0">
                  <CalendarView
                    ref={calendarViewRef}
                    view="week"
                    events={calendarData}
                    selectedDate={selectedDate}
                    onDateSelect={onDateSelect}
                    onEventChange={onEventsChange}
                  />
                </TabsContent>
                
                <TabsContent value="month" className="m-0">
                  <CalendarView
                    ref={calendarViewRef}
                    view="month"
                    events={calendarData}
                    selectedDate={selectedDate}
                    onDateSelect={onDateSelect}
                    onEventChange={onEventsChange}
                  />
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
          
          {publicCalendarUrl && (
            <Card className="shadow-sm overflow-hidden">
              <CardContent className="p-0">
                <iframe 
                  ref={iframeRef}
                  src={publicCalendarUrl}
                  className="w-full border-0"
                  height="600" 
                  frameBorder="0" 
                  scrolling="no"
                  title="Google Calendar"
                ></iframe>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default CalendarViewWrapper;
