
import React from 'react';
import { cn } from '@/lib/utils';

interface GridProps {
  children: React.ReactNode;
  columns: number;
  className?: string;
}

const Grid: React.FC<GridProps> = ({ children, columns, className }) => {
  return (
    <div className={cn(`grid grid-cols-${columns}`, className)}>
      {children}
    </div>
  );
};

export { Grid };
