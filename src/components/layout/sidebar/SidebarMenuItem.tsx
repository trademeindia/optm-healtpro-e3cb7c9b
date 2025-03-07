
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
  
  // Check if this menu item is active - fix for Health Apps highlighting issue
  const isActive = 
    location.pathname === item.path || 
    (item.path === '/patients' && location.pathname.startsWith('/patient/')) ||
    (location.pathname === '/dashboard' && item.path === '/dashboard') ||
    (location.pathname === '/patient-dashboard' && item.path === '/patient-dashboard') ||
    (location.pathname === '/biomarkers' && item.path === '/biomarkers') ||
    (location.pathname === '/health-apps' && item.path === '/health-apps') ||
    (location.pathname === '/patient-reports' && item.path === '/patient-reports') ||
    (location.pathname === '/appointments' && item.path === '/appointments') ||
    (location.pathname === '/settings' && item.path === '/settings') ||
    (location.pathname === '/help' && item.path === '/help');

  return (
    <li>
      <button
        onClick={() => onNavigate(item.path)}
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
        
        {/* Tooltip for description - only shown on desktop */}
        <div className="absolute left-full ml-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs rounded p-2 w-48 z-50 pointer-events-none shadow-md">
          {item.description}
        </div>
      </button>
    </li>
  );
};
