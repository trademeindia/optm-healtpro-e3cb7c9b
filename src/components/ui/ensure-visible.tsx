
import React from 'react';
import { cn } from '@/lib/utils';

interface EnsureVisibleProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * A wrapper component that ensures its children are visible by adding
 * visibility and opacity styles. Useful for fixing common UI issues.
 */
export const EnsureVisible = ({ children, className }: EnsureVisibleProps) => {
  return (
    <div 
      className={cn(
        "visible opacity-100 z-1 relative", 
        className
      )}
      style={{ 
        visibility: 'visible', 
        opacity: 1, 
        position: 'relative', 
        zIndex: 1 
      }}
    >
      {children}
    </div>
  );
};

/**
 * A wrapper component for dialogs and modals to ensure they are visible
 * and have proper z-index.
 */
export const EnsureVisibleDialog = ({ children, className }: EnsureVisibleProps) => {
  return (
    <div 
      className={cn(
        "visible opacity-100 z-50 relative", 
        className
      )}
      style={{ 
        visibility: 'visible', 
        opacity: 1, 
        position: 'relative', 
        zIndex: 50 
      }}
    >
      {children}
    </div>
  );
};

/**
 * A wrapper component for dropdown menus, select menus, etc.
 */
export const EnsureVisibleDropdown = ({ children, className }: EnsureVisibleProps) => {
  return (
    <div 
      className={cn(
        "visible opacity-100 z-40 relative bg-background", 
        className
      )}
      style={{ 
        visibility: 'visible', 
        opacity: 1, 
        position: 'relative', 
        zIndex: 40,
        backgroundColor: 'var(--background)' 
      }}
    >
      {children}
    </div>
  );
};
