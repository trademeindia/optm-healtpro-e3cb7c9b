
import React from 'react';
import { PatientsLayoutProps } from '../types';

export const PatientsLayout: React.FC<PatientsLayoutProps> = ({ children }) => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      {children}
    </div>
  );
};
