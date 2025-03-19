
import React from 'react';
import { cn } from '@/lib/utils';

type CardGridProps = {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
};

export const CardGrid: React.FC<CardGridProps> = ({
  children,
  columns = 2,
  gap = 'md',
  className,
}) => {
  const getGapSize = () => {
    switch (gap) {
      case 'sm':
        return 'gap-2';
      case 'lg':
        return 'gap-6';
      case 'md':
      default:
        return 'gap-4';
    }
  };

  const getColumnsClass = () => {
    switch (columns) {
      case 1:
        return 'grid-cols-1';
      case 3:
        return 'sm:grid-cols-2 lg:grid-cols-3';
      case 4:
        return 'sm:grid-cols-2 lg:grid-cols-4';
      case 2:
      default:
        return 'sm:grid-cols-2';
    }
  };

  return (
    <div
      className={cn(
        'grid grid-cols-1',
        getColumnsClass(),
        getGapSize(),
        className
      )}
    >
      {children}
    </div>
  );
};
