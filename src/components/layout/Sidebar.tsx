import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProps } from './sidebar/types';
import { getDoctorMenuItems, getPatientMenuItems, getBottomMenuItems } from './sidebar/menu-config';
import { MobileToggle } from './sidebar/MobileToggle';
import { SidebarContent } from './sidebar/SidebarContent';
import { useSidebarResponsive } from './sidebar/useSidebarResponsive';
const Sidebar: React.FC<SidebarProps> = ({
  className
}) => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const {
    user
  } = useAuth(); // Get the current user
  const {
    isOpen,
    isMobile,
    toggleSidebar,
    setIsOpen
  } = useSidebarResponsive();

  // Determine which menu items to show based on user role
  const menuItems = user?.role === 'doctor' ? getDoctorMenuItems() : getPatientMenuItems();
  const bottomMenuItems = getBottomMenuItems();
  const handleNavigation = (path: string) => {
    // Close sidebar on mobile after navigation
    if (isMobile) {
      setIsOpen(false);
    }

    // Show toast notification for navigation
    toast({
      title: `Navigating to ${path.substring(1)}`,
      description: `Loading ${path.substring(1)} page...`
    });

    // Navigate to the path
    navigate(path);
  };
  return <>
      <MobileToggle isOpen={isOpen} toggleSidebar={toggleSidebar} />
      
      {/* Use conditional classes for mobile sidebar */}
      
      
      {/* Add overlay for mobile */}
      {isMobile && isOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsOpen(false)} />}
    </>;
};
export default Sidebar;