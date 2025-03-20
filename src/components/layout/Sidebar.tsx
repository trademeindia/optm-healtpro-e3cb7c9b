
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { ChevronRight, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarContent } from './sidebar/SidebarContent';
import { getDoctorMenuItems, getPatientMenuItems, getReceptionistMenuItems, getBottomMenuItems } from './sidebar/menu-config';

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Get the correct menu items based on user role
  const getMenuItems = () => {
    if (user?.role === 'doctor') {
      return getDoctorMenuItems();
    } else if (user?.role === 'receptionist') {
      return getReceptionistMenuItems();
    } else {
      return getPatientMenuItems();
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    if (window.innerWidth < 1024) {
      setIsMobileOpen(false);
    }
  };

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      const mobileToggle = document.getElementById('mobile-toggle');
      
      if (
        sidebar && 
        mobileToggle && 
        !sidebar.contains(event.target as Node) && 
        !mobileToggle.contains(event.target as Node) && 
        isMobileOpen
      ) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileOpen]);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
        setIsCollapsed(false);
      } else {
        setIsCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mobile sidebar toggle button
  const MobileToggle = (
    <Button
      id="mobile-toggle"
      variant="ghost"
      size="icon"
      onClick={toggleMobileSidebar}
      className="lg:hidden fixed top-4 left-4 z-50"
    >
      <Menu className="h-5 w-5" />
      <span className="sr-only">Toggle Menu</span>
    </Button>
  );

  return (
    <>
      {MobileToggle}
      
      <aside
        id="sidebar"
        className={`
          bg-card border-r border-border
          flex flex-col h-screen transition-all duration-300 overflow-hidden
          ${isCollapsed ? 'w-16' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          fixed z-40 lg:relative lg:translate-x-0
        `}
      >
        <div className="flex-1 flex flex-col h-full pt-6 pb-4">
          <SidebarContent
            menuItems={getMenuItems()}
            bottomMenuItems={getBottomMenuItems()}
            onNavigate={handleNavigate}
          />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="absolute top-2 right-2 hidden lg:flex"
          >
            <ChevronRight
              className={`h-5 w-5 transition-transform duration-300 ${
                isCollapsed ? '' : 'rotate-180'
              }`}
            />
            <span className="sr-only">
              {isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            </span>
          </Button>
        </div>
      </aside>
      
      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
