
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Process iCal URL to make it displayable in an iframe
  const getDisplayUrl = (url: string) => {
    try {
      // If the URL is already an embed URL, use it as is
      if (url.includes('calendar/embed')) {
        return url;
      }
      
      // If the URL is an iCal URL, convert it to the embed format
      if (url.includes('/ical/') && url.endsWith('.ics')) {
        // Extract the calendar ID from the iCal URL
        const match = url.match(/calendar\/ical\/([^\/]+)/);
        if (match && match[1]) {
          const calendarId = encodeURIComponent(match[1]);
          return `https://calendar.google.com/calendar/embed?src=${calendarId}&ctz=UTC`;
        }
      }
      
      // Handle the case where we have a .ics URL format
      if (url.includes('.ics')) {
        const calendarIdMatch = url.match(/([a-zA-Z0-9-_]+)%40/);
        if (calendarIdMatch && calendarIdMatch[1]) {
          const calendarId = `${calendarIdMatch[1]}%40group.calendar.google.com`;
          return `https://calendar.google.com/calendar/embed?src=${calendarId}&ctz=UTC`;
        }
      }
      
      // Default embed URL if we can't extract a proper calendar ID
      return `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(url)}&ctz=UTC`;
    } catch (err) {
      console.error("Error processing calendar URL:", err);
      setError("Failed to process calendar URL");
      return "about:blank";
    }
  };

  const displayUrl = getDisplayUrl(publicCalendarUrl);
  
  // For debugging
  useEffect(() => {
    console.log("Calendar iframe URL:", displayUrl);
  }, [displayUrl]);

  // Setup a function to reload the iframe when needed
  const reloadIframe = () => {
    if (iframeRef.current) {
      setIsLoading(true);
      
      // Store the current src
      const src = iframeRef.current.src;
      
      // Clear and reset iframe src to force reload
      iframeRef.current.src = 'about:blank';
      
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = src;
        }
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
        <div className="relative h-[450px]">
          {isLoading && (
            <div className="absolute inset-0 bg-background/70 flex items-center justify-center z-10">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 bg-background/70 flex flex-col items-center justify-center z-10">
              <p className="text-destructive mb-2">{error}</p>
              <button 
                onClick={reloadIframe}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Retry
              </button>
            </div>
          )}
          
          <iframe 
            ref={iframeRef}
            src={displayUrl}
            className="w-full h-full border-0"
            frameBorder="0" 
            scrolling="no"
            title="Google Calendar"
            onLoad={() => {
              console.log("Google Calendar iframe loaded");
              setIsLoading(false);
            }}
            onError={(e) => {
              console.error("Error loading Google Calendar iframe:", e);
              setIsLoading(false);
              setError("Failed to load calendar");
            }}
          ></iframe>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarIframe;
