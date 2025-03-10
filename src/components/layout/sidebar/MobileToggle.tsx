
import React from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileToggleProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const MobileToggle: React.FC<MobileToggleProps> = ({ 
  isOpen, 
  toggleSidebar 
}) => {
  return (
    <Button
      onClick={toggleSidebar}
      variant="ghost"
      size="icon"
      className="lg:hidden fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm shadow-sm"
      aria-label="Toggle sidebar"
    >
      {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </Button>
  );
};
