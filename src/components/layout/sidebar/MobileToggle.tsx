
import React from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MobileToggleProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  className?: string;
}

export const MobileToggle: React.FC<MobileToggleProps> = ({ 
  isOpen, 
  toggleSidebar,
  className
}) => {
  return (
    <Button
      onClick={toggleSidebar}
      variant="ghost"
      size="icon"
      className={cn(
        "h-8 w-8 p-0 flex-shrink-0 transition-all",
        isOpen ? "text-primary" : "text-muted-foreground",
        className
      )}
      aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
    >
      {isOpen ? (
        <X className="h-5 w-5" />
      ) : (
        <Menu className="h-5 w-5" />
      )}
    </Button>
  );
};
