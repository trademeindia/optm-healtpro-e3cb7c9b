
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
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
  const { toast } = useToast();
  const { user } = useAuth();
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
    
    // Navigate to the path
    navigate(path);
  };

  return (
    <>
      <MobileToggle isOpen={isOpen} toggleSidebar={toggleSidebar} />
      
      {/* Sidebar component with conditional classes */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 flex-shrink-0 bg-background",
        "transition-all duration-300 ease-in-out",
        "h-full border-r border-r-border",
        // Width and position based on state
        isOpen ? "w-64" : "w-0 lg:w-64",
        // Extra classes
        className
      )}>
        <div className={cn(
          "h-full w-64 py-6",
          !isOpen && "lg:translate-x-0 -translate-x-full",
          isOpen && "translate-x-0",
          "transition-transform duration-300 ease-in-out"
        )}>
          <SidebarContent 
            menuItems={menuItems}
            bottomMenuItems={bottomMenuItems}
            onNavigate={handleNavigation}
          />
        </div>
      </aside>
      
      {/* Overlay for mobile when sidebar is open */}
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
