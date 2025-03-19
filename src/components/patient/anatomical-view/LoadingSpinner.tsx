
import React from 'react';
import { Html } from '@react-three/drei';

const LoadingSpinner: React.FC = () => {
  return (
    <Html center>
      <div className="flex items-center justify-center h-full w-full bg-white/80 dark:bg-gray-800/80 rounded-lg p-4 shadow-lg">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    </Html>
  );
};

export default LoadingSpinner;
