
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
  const iframeMountedRef = useRef(false);
  const iframeLoadingRef = useRef(false);

  // Setup a function to reload the iframe when needed
  const reloadIframe = () => {
    // Only reload if we're not already reloading
    if (iframeRef.current && !iframeLoadingRef.current) {
      console.log("Reloading Google Calendar iframe directly");
      iframeLoadingRef.current = true;
      
      // Store the current src
      const src = iframeRef.current.src;
      
      // Clear and reset iframe src to force reload
      iframeRef.current.src = '';
      
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = src;
        }
        setTimeout(() => {
          iframeLoadingRef.current = false;
        }, 1000); // Allow time for the iframe to fully load
      }, 100);
    } else if (reloadCalendarIframe) {
      reloadCalendarIframe();
    }
  };

  // Initial mount/load for iframe
  useEffect(() => {
    if (isAuthorized && publicCalendarUrl && !iframeMountedRef.current) {
      iframeMountedRef.current = true;
      console.log("Calendar iframe mounted initially");
    }
  }, [isAuthorized, publicCalendarUrl]);

  // Add event listener for calendar changes
  useEffect(() => {
    if (isAuthorized && publicCalendarUrl) {
      // Add event listener for custom reload events
      const handleCalendarUpdate = () => {
        console.log("Calendar update event received, reloading iframe");
        reloadIframe();
      };
      
      // Listen for all appointment-related events to trigger iframe reload
      window.addEventListener('calendar-updated', handleCalendarUpdate);
      window.addEventListener('appointment-created', handleCalendarUpdate);
      window.addEventListener('appointment-updated', handleCalendarUpdate);
      window.addEventListener('appointment-deleted', handleCalendarUpdate);
      
      return () => {
        window.removeEventListener('calendar-updated', handleCalendarUpdate);
        window.removeEventListener('appointment-created', handleCalendarUpdate);
        window.removeEventListener('appointment-updated', handleCalendarUpdate);
        window.removeEventListener('appointment-deleted', handleCalendarUpdate);
      };
    }
  }, [isAuthorized, publicCalendarUrl]);

  return (
    <div className="flex flex-col space-y-4 md:space-y-6 h-full">
      {!isAuthorized ? (
        <Card className="shadow-sm hover:shadow-md transition-all duration-200">
          <CardContent className="p-6">
            <ConnectCalendarCard 
              onConnect={onConnectCalendar}
              isConnecting={isConnecting}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="shadow-sm overflow-hidden border border-border/30 hover:shadow-md transition-all duration-200">
            <Tabs value={selectedView} onValueChange={(value) => setSelectedView(value as any)}>
              <div className="bg-muted/30 border-b px-3 py-2 md:px-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-base md:text-lg font-semibold text-foreground">Calendar</h2>
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
                    onEventsChange={onEventsChange}
                    isLoading={isLoading}
                  />
                </TabsContent>
                
                <TabsContent value="week" className="m-0">
                  <CalendarView
                    ref={calendarViewRef}
                    view="week"
                    events={calendarData}
                    selectedDate={selectedDate}
                    onDateSelect={onDateSelect}
                    onEventsChange={onEventsChange}
                    isLoading={isLoading}
                  />
                </TabsContent>
                
                <TabsContent value="month" className="m-0">
                  <CalendarView
                    ref={calendarViewRef}
                    view="month"
                    events={calendarData}
                    selectedDate={selectedDate}
                    onDateSelect={onDateSelect}
                    onEventsChange={onEventsChange}
                    isLoading={isLoading}
                  />
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
          
          {publicCalendarUrl && (
            <Card className="shadow-sm overflow-hidden border border-border/30">
              <CardContent className="p-0">
                <div className="relative">
                  {iframeLoadingRef.current && (
                    <div className="absolute inset-0 bg-background/70 flex items-center justify-center z-10">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  )}
                  <iframe 
                    ref={iframeRef}
                    src={publicCalendarUrl}
                    className="w-full border-0"
                    height="450" 
                    frameBorder="0" 
                    scrolling="no"
                    title="Google Calendar"
                    onLoad={() => {
                      console.log("Main Google Calendar iframe loaded");
                      iframeLoadingRef.current = false;
                    }}
                    onError={() => {
                      console.error("Error loading main Google Calendar iframe");
                      iframeLoadingRef.current = false;
                    }}
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default CalendarViewWrapper;
