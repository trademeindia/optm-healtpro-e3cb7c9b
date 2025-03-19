
import React from 'react';
import { Html } from '@react-three/drei';

const LoadingSpinner: React.FC = () => {
  return (
    <Html center>
      <div className="flex items-center justify-center h-24 w-24 bg-white/90 dark:bg-gray-800/90 rounded-lg p-4 shadow-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
      </div>
    </Html>
  );
};

export default LoadingSpinner;
