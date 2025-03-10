import { useState, useEffect } from 'react';

export const useSidebarResponsive = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if mobile on mount and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      const mobileView = window.innerWidth < 1024;
      setIsMobile(mobileView);
      // Only auto-close on initial load for mobile, not on every resize
      if (mobileView && !isOpen) {
        // Keep sidebar closed if it was already closed
        setIsOpen(false);
      } else if (!mobileView) {
        // Always open on desktop
        setIsOpen(true);
      }
    };
    
    // Initial check
    checkIfMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, [isOpen]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return {
    isOpen,
    setIsOpen,
    isMobile,
    toggleSidebar
  };
};
