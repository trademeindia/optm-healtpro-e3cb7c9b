
import React from 'react';
import { cn } from '@/lib/utils';

interface GridProps {
  children: React.ReactNode;
  columns: number;
  className?: string;
}

const Grid: React.FC<GridProps> = ({ children, columns, className }) => {
  // Dynamic class generation based on column count
  const gridColumnsClass = `grid-cols-${columns}`;
  
  return (
    <div className={cn(`grid ${gridColumnsClass}`, className)}>
      {children}
    </div>
  );
};

export { Grid };
