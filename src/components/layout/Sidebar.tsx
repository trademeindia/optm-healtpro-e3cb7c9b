
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { toast } from "sonner";
import { useAuth } from '@/contexts/auth'; // Fix import path
import { SidebarProps } from './sidebar/types';
import { 
  getDoctorMenuItems, 
  getPatientMenuItems, 
  getBottomMenuItems 
} from './sidebar/menu-config';
import { MobileToggle } from './sidebar/MobileToggle';
import { SidebarContent } from './sidebar/SidebarContent';
import { useSidebarResponsive } from './sidebar/useSidebarResponsive';

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get the current user
  const { isOpen, isMobile, toggleSidebar, setIsOpen } = useSidebarResponsive();
  
  // Determine which menu items to show based on user role
  const menuItems = user?.role === 'doctor' 
    ? getDoctorMenuItems() 
    : getPatientMenuItems();

  const bottomMenuItems = getBottomMenuItems();

  const handleNavigation = (path: string) => {
    // Close sidebar on mobile after navigation
    if (isMobile) {
      setIsOpen(false);
    }
    
    // Show toast notification for navigation
    toast.info(`Navigating to ${path.substring(1)}`, {
      description: `Loading ${path.substring(1)} page...`,
      duration: 3000
    });
    
    // Navigate to the path
    navigate(path);
  };

  return (
    <>
      <MobileToggle isOpen={isOpen} toggleSidebar={toggleSidebar} />
      
      {/* Use conditional classes for mobile sidebar */}
      <aside className={cn(
        "fixed lg:relative h-screen lg:h-full lg:w-64 bg-white dark:bg-gray-800 border-r border-r-gray-200 dark:border-r-gray-700 py-6 z-40 transition-all duration-300 shadow-sm",
        isOpen ? "w-64 left-0" : "-left-64 lg:left-0 lg:w-0",
        isMobile && isOpen ? "inset-0 w-64 h-full" : "",
        className
      )}>
        <SidebarContent 
          menuItems={menuItems}
          bottomMenuItems={bottomMenuItems}
          onNavigate={handleNavigation}
        />
      </aside>
      
      {/* Add overlay for mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
