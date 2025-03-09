
import React from 'react';
import { MenuItem } from './types';
import { SidebarMenuItem } from './SidebarMenuItem';
import { HeartPulse } from 'lucide-react';

interface SidebarContentProps {
  menuItems: MenuItem[];
  bottomMenuItems: MenuItem[];
  onNavigate: (path: string) => void;
}

export const SidebarContent: React.FC<SidebarContentProps> = ({
  menuItems,
  bottomMenuItems,
  onNavigate
}) => {
  return (
    <>
      <div className="px-4 mb-8 flex items-center justify-center">
        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
          <HeartPulse className="w-6 h-6 text-white" />
        </div>
      </div>
      
      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <SidebarMenuItem 
              key={item.path} 
              item={item} 
              onNavigate={onNavigate} 
            />
          ))}
        </ul>
      </nav>
      
      <div className="mt-auto px-3">
        <ul className="space-y-1">
          {bottomMenuItems.map((item) => (
            <SidebarMenuItem 
              key={item.path} 
              item={item} 
              onNavigate={onNavigate} 
            />
          ))}
        </ul>
      </div>
    </>
  );
};
