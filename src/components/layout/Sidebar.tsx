
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  BarChart2, 
  Settings, 
  HelpCircle,
  HeartPulse,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if mobile on mount and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/',
      description: 'Overview of patient data and clinical metrics'
    },
    { 
      icon: Users, 
      label: 'Patients', 
      path: '/patients',
      description: 'Manage patient records and information'
    },
    { 
      icon: HeartPulse, 
      label: 'Biomarkers', 
      path: '/biomarkers',
      description: 'Track key health indicators and lab results'
    },
    { 
      icon: Calendar, 
      label: 'Appointments', 
      path: '/appointments',
      description: 'Schedule and manage patient appointments'
    },
    { 
      icon: FileText, 
      label: 'Reports', 
      path: '/reports',
      description: 'Access and create clinical reports and documentation'
    },
    { 
      icon: BarChart2, 
      label: 'Analytics', 
      path: '/analytics',
      description: 'Visualize clinical data and treatment outcomes'
    },
  ];

  const bottomMenuItems = [
    { 
      icon: Settings, 
      label: 'Settings', 
      path: '/settings',
      description: 'Configure application preferences'
    },
    { 
      icon: HelpCircle, 
      label: 'Help', 
      path: '/help',
      description: 'Get assistance and support'
    },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Mobile toggle button that's always visible
  const MobileToggle = () => (
    <Button
      onClick={toggleSidebar}
      variant="ghost"
      size="icon"
      className="lg:hidden fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm"
    >
      {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </Button>
  );

  return (
    <>
      <MobileToggle />
      
      {/* Use conditional classes for mobile sidebar */}
      <aside className={cn(
        "h-full lg:w-64 glass-morphism border-r border-r-border py-6 z-40 transition-all duration-300",
        isOpen ? "fixed lg:relative w-64 left-0" : "fixed -left-64 lg:left-0 lg:w-0",
        isMobile && isOpen ? "fixed inset-0 w-64 h-full" : "",
        className
      )}>
        <div className="px-4 mb-8 flex items-center justify-center">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
            <HeartPulse className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <nav className="flex-1 px-3">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors group relative",
                    location.pathname === item.path
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:bg-primary/5 hover:text-primary"
                  )}
                  onClick={() => isMobile && setIsOpen(false)}
                >
                  <item.icon className={cn(
                    "w-5 h-5",
                    location.pathname === item.path ? "text-primary" : "text-foreground/70"
                  )} />
                  {item.label}
                  
                  {/* Tooltip for description - only shown on desktop */}
                  <div className="absolute left-full ml-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs rounded p-2 w-48 z-50 pointer-events-none shadow-md">
                    {item.description}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="mt-auto px-3">
          <ul className="space-y-1">
            {bottomMenuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors group relative",
                    location.pathname === item.path
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:bg-primary/5 hover:text-primary"
                  )}
                  onClick={() => isMobile && setIsOpen(false)}
                >
                  <item.icon className={cn(
                    "w-5 h-5",
                    location.pathname === item.path ? "text-primary" : "text-foreground/70"
                  )} />
                  {item.label}
                  
                  {/* Tooltip for description - only shown on desktop */}
                  <div className="absolute left-full ml-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs rounded p-2 w-48 z-50 pointer-events-none shadow-md">
                    {item.description}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
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
