
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
                    ref={calendarViewRef}
                    view="day"
                    events={calendarData}
                    isLoading={isLoading}
                    selectedDate={selectedDate}
                    onDateSelect={onDateSelect}
                    onEventsChange={onEventsChange}
                    reloadCalendarIframe={reloadIframe}
                  />
                </TabsContent>
                
                <TabsContent value="week" className="mt-0">
                  <CalendarView
                    ref={calendarViewRef}
                    view="week"
                    events={calendarData}
                    isLoading={isLoading}
                    selectedDate={selectedDate}
                    onDateSelect={onDateSelect}
                    onEventsChange={onEventsChange}
                    reloadCalendarIframe={reloadIframe}
                  />
                </TabsContent>
                
                <TabsContent value="month" className="mt-0">
                  <CalendarView
                    ref={calendarViewRef}
                    view="month"
                    events={calendarData}
                    isLoading={isLoading}
                    selectedDate={selectedDate}
                    onDateSelect={onDateSelect}
                    onEventsChange={onEventsChange}
                    reloadCalendarIframe={reloadIframe}
                  />
                </TabsContent>
              </Tabs>
              
              {/* Enhanced embedded Google Calendar with better dimensions */}
              {publicCalendarUrl && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-base font-medium mb-3">Google Calendar View</h3>
                  <div className="w-full h-[600px] bg-muted/30 border rounded-lg overflow-hidden">
                    <iframe 
                      ref={iframeRef}
                      src={publicCalendarUrl}
                      style={{ border: 0 }} 
                      width="100%" 
                      height="100%" 
                      frameBorder="0" 
                      scrolling="no"
                      title="Google Calendar"
                      onLoad={() => console.log("Google Calendar iframe loaded")}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarViewWrapper;
