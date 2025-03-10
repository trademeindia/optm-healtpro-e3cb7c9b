
import { useState, useEffect } from 'react';

export const useSidebarResponsive = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if mobile on mount and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      const mobileView = window.innerWidth < 1024;
      setIsMobile(mobileView);
      
      // Only auto-close sidebar on mobile
      if (mobileView) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };
    
    // Initial check
    checkIfMobile();
    
    // Set up listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up listener when component unmounts
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

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
