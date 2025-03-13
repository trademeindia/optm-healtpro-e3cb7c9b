
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface CalendarIframeProps {
  publicCalendarUrl: string;
  reloadCalendarIframe?: () => void;
}

const CalendarIframe: React.FC<CalendarIframeProps> = ({ 
  publicCalendarUrl,
  reloadCalendarIframe
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Format URL to ensure it's using the HTML embed version
  const formatCalendarUrl = (url: string) => {
    if (!url) return '';
    
    // Already formatted as HTML
    if (url.includes('htmlembed')) {
      return url;
    }
    
    // Convert from ical to htmlembed
    if (url.includes('/ical/')) {
      return url.replace('/ical/', '/htmlembed?');
    }
    
    // Convert from basic to htmlembed
    if (url.includes('/basic')) {
      return url.replace('/basic', '/htmlembed');
    }
    
    // Default embed URL transformation
    if (url.includes('calendar.google.com')) {
      return `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(url.split('calendar/')[1].split('/')[0])}&ctz=local`;
    }
    
    return url;
  };
  
  const formattedUrl = formatCalendarUrl(publicCalendarUrl);
  
  // Handle iframe load events
  const handleIframeLoad = () => {
    console.log("Main Google Calendar iframe loaded");
    setIsLoading(false);
    setHasError(false);
  };
  
  // Handle iframe errors
  const handleIframeError = () => {
    console.error("Failed to load Google Calendar iframe");
    setIsLoading(false);
    setHasError(true);
  };

  // Listen for calendar update events
  useEffect(() => {
    const handleCalendarUpdated = () => {
      console.log("Calendar update event received, reloading iframe");
      
      if (iframeRef.current) {
        // Force reload the iframe
        console.log("Reloading Google Calendar iframe directly");
        const currentSrc = iframeRef.current.src;
        iframeRef.current.src = "about:blank";
        
        // Small delay before setting back the original source
        setTimeout(() => {
          if (iframeRef.current) {
            iframeRef.current.src = currentSrc;
          }
        }, 100);
      }
    };
    
    window.addEventListener('calendar-updated', handleCalendarUpdated);
    
    return () => {
      window.removeEventListener('calendar-updated', handleCalendarUpdated);
    };
  }, []);

  // Manual reload functionality
  useEffect(() => {
    if (reloadCalendarIframe) {
      const originalReload = reloadCalendarIframe;
      
      // Override the reload function to directly manipulate the iframe
      reloadCalendarIframe = () => {
        console.log("Calendar iframe reload requested");
        
        if (iframeRef.current) {
          setIsLoading(true);
          const currentSrc = iframeRef.current.src;
          iframeRef.current.src = "about:blank";
          
          setTimeout(() => {
            if (iframeRef.current) {
              iframeRef.current.src = currentSrc;
            }
          }, 100);
        }
        
        // Call the original reload function for any additional logic
        originalReload();
      };
    }
  }, [reloadCalendarIframe]);

  return (
    <Card className="overflow-hidden border border-border/30 hover:shadow-md transition-all duration-200">
      <CardContent className="p-0 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-background/70 flex items-center justify-center z-10">
            <Skeleton className="h-[400px] w-full rounded-none" />
          </div>
        )}
        
        {hasError && (
          <div className="h-[400px] w-full flex items-center justify-center bg-muted/20 text-muted-foreground">
            Unable to load calendar. Please try again later.
          </div>
        )}
        
        <iframe
          ref={iframeRef}
          src={formattedUrl}
          title="Google Calendar"
          width="100%"
          height="500"
          frameBorder="0"
          scrolling="yes"
          className="w-full min-h-[400px]"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      </CardContent>
    </Card>
  );
};

export default CalendarIframe;
