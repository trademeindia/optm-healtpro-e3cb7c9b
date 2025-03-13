
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, RefreshCw } from 'lucide-react';

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
  const [retryCount, setRetryCount] = useState(0);
  const reloadingRef = useRef(false);
  const lastReloadTimeRef = useRef(0);

  // Process iCal URL to make it displayable in an iframe
  const getDisplayUrl = useCallback((url: string) => {
    try {
      if (!url) {
        console.error("No calendar URL provided");
        return null;
      }
      
      console.log("Processing calendar URL:", url);
      
      // If the URL is already an embed URL, use it as is
      if (url.includes('calendar/embed')) {
        return url;
      }
      
      // Handle calendar.google.com URLs directly
      if (url.includes('calendar.google.com')) {
        // If it's already in a reasonable format
        if (url.includes('/ical/')) {
          // Extract the calendar ID from the iCal URL
          const match = url.match(/calendar\/ical\/([^\/]+)/);
          if (match && match[1]) {
            const calendarId = decodeURIComponent(match[1]);
            return `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(calendarId)}&ctz=UTC`;
          }
        }
        
        // Handle basic.ics URLs
        if (url.includes('/basic.ics')) {
          const idMatch = url.match(/([a-zA-Z0-9_-]+(?:%40|@)group\.calendar\.google\.com)/i);
          if (idMatch && idMatch[1]) {
            const calendarId = idMatch[1].replace('%40', '@');
            return `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(calendarId)}&ctz=UTC`;
          }
        }
      }
      
      // Fallback method: try to extract an email-like ID
      const emailMatch = url.match(/([a-zA-Z0-9_.-]+@[a-zA-Z0-9_.-]+\.[a-zA-Z0-9_.-]+)/i);
      if (emailMatch && emailMatch[1]) {
        return `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(emailMatch[1])}&ctz=UTC`;
      }
      
      // Another fallback: look for a long alphanumeric string that might be a calendar ID
      const idMatch = url.match(/([a-zA-Z0-9]{20,})/);
      if (idMatch && idMatch[1]) {
        return `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(idMatch[1])}%40group.calendar.google.com&ctz=UTC`;
      }
      
      // Simple conversion for ical URLs
      if (url.endsWith('.ics')) {
        // Remove the .ics extension and add the embed parameters
        const baseUrl = url.replace('.ics', '');
        return `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(baseUrl)}&ctz=UTC`;
      }
      
      // Last resort: direct embed with the URL as the src parameter
      return `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(url)}&ctz=UTC`;
    } catch (err) {
      console.error("Error processing calendar URL:", err);
      setError("Failed to process calendar URL");
      return null;
    }
  }, []);

  // Alternative method to try if main method fails
  const getFallbackDisplayUrl = useCallback(() => {
    try {
      // Extract calendar ID using a different pattern
      const idMatch = publicCalendarUrl.match(/([a-zA-Z0-9]{20,})/);
      if (idMatch && idMatch[1]) {
        const calId = idMatch[1];
        return `https://calendar.google.com/calendar/embed?src=${calId}%40group.calendar.google.com&ctz=UTC`;
      }
      return null;
    } catch (err) {
      console.error("Error in fallback URL generation:", err);
      return null;
    }
  }, [publicCalendarUrl]);

  const displayUrl = getDisplayUrl(publicCalendarUrl);
  const fallbackUrl = displayUrl ? null : getFallbackDisplayUrl();
  const finalUrl = displayUrl || fallbackUrl || "about:blank";
  
  // Setup a function to reload the iframe when needed
  const reloadIframe = useCallback(() => {
    // Prevent multiple reloads in quick succession
    const now = Date.now();
    if (reloadingRef.current || (now - lastReloadTimeRef.current < 3000)) {
      console.log("Reload already in progress or too soon since last reload, skipping");
      return;
    }
    
    reloadingRef.current = true;
    lastReloadTimeRef.current = now;
    
    if (iframeRef.current) {
      setIsLoading(true);
      setError(null);
      setRetryCount(prev => prev + 1);
      
      // Store the current src
      const src = iframeRef.current.src;
      
      // Clear and reset iframe src to force reload
      iframeRef.current.src = 'about:blank';
      
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = `${src}${src.includes('?') ? '&' : '?'}cachebust=${Date.now()}`;
          
          // Set a timeout to prevent permanent loading state if iframe fails to trigger onLoad
          setTimeout(() => {
            setIsLoading(false);
            reloadingRef.current = false;
          }, 5000);
        }
      }, 200);
    } else if (reloadCalendarIframe) {
      reloadCalendarIframe();
      
      // Set a timeout to clear loading state in case the callback doesn't reset it
      setTimeout(() => {
        setIsLoading(false);
        reloadingRef.current = false;
      }, 3000);
    }
    
    // Safety timeout to ensure reloadingRef is reset
    setTimeout(() => {
      reloadingRef.current = false;
    }, 5000);
  }, [reloadCalendarIframe]);

  // Initial mount/load for iframe
  useEffect(() => {
    if (publicCalendarUrl && !iframeMountedRef.current) {
      iframeMountedRef.current = true;
      console.log("Calendar iframe mounted initially");
    }
  }, [publicCalendarUrl]);

  // Add event listener for calendar changes with debouncing to prevent rapid reloads
  useEffect(() => {
    if (!publicCalendarUrl) return;
    
    let reloadTimeout: NodeJS.Timeout | null = null;
    
    // Debounced reload handler to prevent multiple reloads
    const handleCalendarUpdate = () => {
      if (reloadTimeout) {
        clearTimeout(reloadTimeout);
      }
      
      reloadTimeout = setTimeout(() => {
        console.log("Calendar update event received, reloading iframe");
        reloadIframe();
      }, 1500); // Debounce for 1.5 seconds
    };
    
    // Use a single handler for all events to reduce listeners
    const handleAnyAppointmentEvent = (event: Event) => {
      console.log(`Handling calendar event: ${event.type}`);
      handleCalendarUpdate();
    };
    
    // Listen for all appointment-related events to trigger iframe reload
    window.addEventListener('calendar-updated', handleAnyAppointmentEvent);
    window.addEventListener('calendar-data-updated', handleAnyAppointmentEvent);
    
    return () => {
      if (reloadTimeout) {
        clearTimeout(reloadTimeout);
      }
      window.removeEventListener('calendar-updated', handleAnyAppointmentEvent);
      window.removeEventListener('calendar-data-updated', handleAnyAppointmentEvent);
    };
  }, [publicCalendarUrl, reloadIframe]);

  // JSX for empty or error state
  if (!finalUrl || finalUrl === "about:blank") {
    return (
      <Card className="shadow-sm overflow-hidden border border-border/30">
        <CardContent className="p-6 flex flex-col items-center justify-center h-[450px] text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Calendar Not Available</h3>
          <p className="text-muted-foreground mb-4">
            We couldn't load your calendar at this time.
          </p>
          <Button 
            onClick={reloadIframe}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
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
            <div className="absolute inset-0 bg-background/70 flex flex-col items-center justify-center z-10 p-4">
              <Calendar className="h-10 w-10 text-destructive mb-3" />
              <p className="text-destructive font-medium mb-2">{error}</p>
              <p className="text-muted-foreground text-sm mb-4 max-w-md text-center">
                There was a problem loading your calendar. This might be due to a connection issue or an invalid calendar URL.
              </p>
              <Button 
                onClick={reloadIframe}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
            </div>
          )}
          
          <iframe 
            ref={iframeRef}
            src={finalUrl}
            className="w-full h-full border-0"
            frameBorder="0" 
            scrolling="no"
            title="Google Calendar"
            onLoad={() => {
              console.log("Google Calendar iframe loaded");
              setIsLoading(false);
              reloadingRef.current = false;
            }}
            onError={(e) => {
              console.error("Error loading Google Calendar iframe:", e);
              setIsLoading(false);
              setError("Failed to load calendar");
              reloadingRef.current = false;
            }}
          ></iframe>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarIframe;
