
import React from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { DevDashboard } from './components/DevDashboard';

const DevDashboardPage: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return <DevDashboard isMobile={isMobile} />;
};

export default DevDashboardPage;
