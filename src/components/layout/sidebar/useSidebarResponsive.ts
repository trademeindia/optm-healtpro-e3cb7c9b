
import { useState, useEffect, useCallback } from 'react';

export const useSidebarResponsive = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if mobile on mount and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      // Auto-collapse sidebar on small screens
      if (mobile) {
        setIsOpen(false);
      } else if (!localStorage.getItem('sidebar-collapsed')) {
        // Only auto-expand on desktop if user hasn't manually collapsed it
        setIsOpen(true);
      }
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Toggle sidebar and remember state in localStorage
  const toggleSidebar = useCallback(() => {
    setIsOpen(prev => {
      const newState = !prev;
      if (!isMobile) {
        if (newState) {
          localStorage.removeItem('sidebar-collapsed');
        } else {
          localStorage.setItem('sidebar-collapsed', 'true');
        }
      }
      return newState;
    });
  }, [isMobile]);

  return {
    isOpen,
    setIsOpen,
    isMobile,
    toggleSidebar
  };
};
