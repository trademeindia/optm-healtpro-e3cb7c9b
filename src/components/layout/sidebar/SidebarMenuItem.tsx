
import React from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { MenuItem } from './types';

interface SidebarMenuItemProps {
  item: MenuItem;
  onNavigate: (path: string) => void;
}

export const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({ 
  item, 
  onNavigate 
}) => {
  const location = useLocation();
  
  // Check if this menu item is active - simplified logic
  const isActive = (() => {
    const path = location.pathname;
    
    // Exact path match for most items (including /appointments)
    if (path === item.path) {
      return true;
    }
    
    // Special cases for nested routes
    switch (item.path) {
      case '/patients':
        return path.startsWith('/patient/');
      case '/health-apps':
        return path === '/health-apps' || (path.startsWith('/health-apps/') && path !== '/health-apps/');
      default:
        return false;
    }
  })();

  const handleClick = () => {
    onNavigate(item.path);
  };

  return (
    <li>
      <button
        onClick={handleClick}
        className={cn(
          "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors group relative w-full text-left",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-foreground/70 hover:bg-primary/5 hover:text-primary"
        )}
      >
        <item.icon className={cn(
          "w-5 h-5",
          isActive ? "text-primary" : "text-foreground/70"
        )} />
        {item.label}
        
        {/* Active indicator */}
        {isActive && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-primary rounded-r-full" />
        )}
        
        {/* Tooltip for description - only shown on desktop */}
        <div className="absolute left-full ml-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs rounded p-2 w-48 z-50 pointer-events-none shadow-md">
          {item.description}
        </div>
      </button>
    </li>
  );
};
