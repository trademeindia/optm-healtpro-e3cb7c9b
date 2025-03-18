
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingView: React.FC = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
      <Skeleton className="h-12 w-1/3 mx-auto" />
    </div>
  );
};

export default LoadingView;
