
import React, { useRef, useEffect } from 'react';
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

  // Process iCal URL to make it displayable in an iframe if needed
  const getDisplayUrl = (url: string) => {
    // If the URL is an iCal URL, convert it to the embed format
    if (url.includes('/ical/') && url.endsWith('.ics')) {
      // Extract the calendar ID from the iCal URL
      const match = url.match(/calendar\/ical\/([^\/]+)/);
      if (match && match[1]) {
        const calendarId = encodeURIComponent(match[1]);
        return `https://calendar.google.com/calendar/embed?src=${calendarId}&ctz=UTC`;
      }
    }
    
    // If it's already an embed URL, use it as is
    if (url.includes('calendar/embed')) {
      return url;
    }
    
    // Handle the case where we have a basic.ics URL format
    if (url.includes('.ics')) {
      const calendarIdMatch = url.match(/([a-zA-Z0-9-_]+)%40/);
      if (calendarIdMatch && calendarIdMatch[1]) {
        const calendarId = `${calendarIdMatch[1]}%40group.calendar.google.com`;
        return `https://calendar.google.com/calendar/embed?src=${calendarId}&ctz=UTC`;
      }
    }
    
    // Fallback - try to use the URL as is
    return url;
  };

  const displayUrl = getDisplayUrl(publicCalendarUrl);
  
  // For debugging
  useEffect(() => {
    console.log("Calendar iframe URL:", displayUrl);
  }, [displayUrl]);

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
  }, [publicCalendarUrl]);

  if (!displayUrl) {
    return null;
  }

  return (
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
            src={displayUrl}
            className="w-full border-0"
            height="450" 
            frameBorder="0" 
            scrolling="no"
            title="Google Calendar"
            onLoad={() => {
              console.log("Main Google Calendar iframe loaded");
              iframeLoadingRef.current = false;
            }}
            onError={(e) => {
              console.error("Error loading main Google Calendar iframe:", e);
              iframeLoadingRef.current = false;
            }}
          ></iframe>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarIframe;
