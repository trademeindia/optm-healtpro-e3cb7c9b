
import React from 'react';
import { Html } from '@react-three/drei';

const LoadingSpinner: React.FC = () => {
  return (
    <Html center>
      <div className="flex items-center justify-center h-full w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    </Html>
  );
};

export default LoadingSpinner;
