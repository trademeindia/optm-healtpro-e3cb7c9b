
import React, { useRef, useEffect } from 'react';

interface CalendarFrameProps {
  src: string;
  onLoad: () => void;
  onError: (e: React.SyntheticEvent<HTMLIFrameElement, Event>) => void;
}

const CalendarFrame: React.FC<CalendarFrameProps> = ({ src, onLoad, onError }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  return (
    <iframe 
      ref={iframeRef}
      src={src}
      className="w-full h-full border-0"
      frameBorder="0" 
      scrolling="no"
      title="Google Calendar"
      onLoad={onLoad}
      onError={onError}
    />
  );
};

export default CalendarFrame;
