
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingView: React.FC = () => {
  return (
    <div className="space-y-4 py-4">
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
  );
};

export default LoadingView;
