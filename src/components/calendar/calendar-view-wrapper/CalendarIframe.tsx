
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface CalendarIframeProps {
  publicCalendarUrl: string;
  reloadCalendarIframe?: () => void;
}

const CalendarIframe: React.FC<CalendarIframeProps> = ({
  publicCalendarUrl,
  reloadCalendarIframe
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframeMountedRef = useRef(false);
  const iframeLoadingRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const refreshCountRef = useRef(0);

  // Process iCal URL to make it displayable in an iframe if needed
  const getDisplayUrl = (url: string) => {
    // If the URL is an iCal URL, convert it to the embed format
    if (url.includes('/ical/') || url.endsWith('.ics')) {
      // Extract the calendar ID from the iCal URL - this works for Google Calendar iCal URLs
      const match = url.match(/([a-f0-9]+)(%40|\@)group\.calendar\.google\.com/);
      if (match && match[1]) {
        const calendarId = `${match[1]}%40group.calendar.google.com`;
        return `https://calendar.google.com/calendar/embed?src=${calendarId}&ctz=local`;
      }
    }
    return url;
  };

  const displayUrl = getDisplayUrl(publicCalendarUrl);

  // Setup a function to reload the iframe when needed
  const reloadIframe = () => {
    // Only reload if we're not already reloading
    if (iframeRef.current && !iframeLoadingRef.current) {
      console.log("Reloading Google Calendar iframe directly");
      iframeLoadingRef.current = true;
      setIsLoading(true);
      refreshCountRef.current += 1;
      
      // Store the current src
      const src = iframeRef.current.src;
      
      // Clear and reset iframe src to force reload
      iframeRef.current.src = '';
      
      setTimeout(() => {
        if (iframeRef.current) {
          // Add a timestamp to bust cache
          const cacheBuster = `&_refresh=${Date.now()}_${refreshCountRef.current}`;
          const newSrc = src.includes('?') 
            ? `${src}&${cacheBuster}` 
            : `${src}?${cacheBuster}`;
          
          iframeRef.current.src = newSrc;
        }
        setTimeout(() => {
          iframeLoadingRef.current = false;
          setIsLoading(false);
        }, 1000); // Allow time for the iframe to fully load
      }, 100);
    } else if (reloadCalendarIframe) {
      reloadCalendarIframe();
    }
  };

  // Initial mount/load for iframe
  useEffect(() => {
    if (publicCalendarUrl && !iframeMountedRef.current) {
      iframeMountedRef.current = true;
      console.log("Calendar iframe mounted initially");
    }
  }, [publicCalendarUrl]);

  // Add event listener for calendar changes
  useEffect(() => {
    if (publicCalendarUrl) {
      // Add event listener for custom reload events
      const handleCalendarUpdate = () => {
        console.log("Calendar update event received, reloading iframe");
        setTimeout(reloadIframe, 300); // Add slight delay to ensure data is updated
      };
      
      // Listen for all appointment-related events to trigger iframe reload
      window.addEventListener('calendar-updated', handleCalendarUpdate);
      window.addEventListener('appointment-created', handleCalendarUpdate);
      window.addEventListener('appointment-updated', handleCalendarUpdate);
      window.addEventListener('appointment-deleted', handleCalendarUpdate);
      window.addEventListener('calendar-data-updated', handleCalendarUpdate);
      
      return () => {
        window.removeEventListener('calendar-updated', handleCalendarUpdate);
        window.removeEventListener('appointment-created', handleCalendarUpdate);
        window.removeEventListener('appointment-updated', handleCalendarUpdate);
        window.removeEventListener('appointment-deleted', handleCalendarUpdate);
        window.removeEventListener('calendar-data-updated', handleCalendarUpdate);
      };
    }
  }, [publicCalendarUrl]);

  return (
    <Card className="shadow-sm overflow-hidden border border-border/30">
      <CardContent className="p-0">
        <div className="relative">
          {(isLoading || iframeLoadingRef.current) && (
            <div className="absolute inset-0 bg-background/70 flex items-center justify-center z-10">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          )}
          <iframe 
            ref={iframeRef}
            src={displayUrl}
            className="w-full border-0"
            height="450" 
            frameBorder="0" 
            scrolling="no"
            title="Google Calendar"
            onLoad={() => {
              console.log("Main Google Calendar iframe loaded");
              iframeLoadingRef.current = false;
              setIsLoading(false);
            }}
            onError={() => {
              console.error("Error loading main Google Calendar iframe");
              iframeLoadingRef.current = false;
              setIsLoading(false);
            }}
          ></iframe>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarIframe;
