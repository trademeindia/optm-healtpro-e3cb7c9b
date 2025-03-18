
import React from 'react';
import { FitnessProvider } from '@/components/dashboard/FitnessIntegrations';
import FitnessIntegrations from '@/components/dashboard/FitnessIntegrations';
import HealthDataPrivacy from './HealthDataPrivacy';
import SupportedDevices from './SupportedDevices';

interface IntegrationsTabProps {
  providers: FitnessProvider[];
  onConnect: (providerId: string) => Promise<boolean>;
  onDisconnect: (providerId: string) => Promise<boolean>;
  onRefresh: (providerId: string) => Promise<boolean>;
}

const IntegrationsTab: React.FC<IntegrationsTabProps> = ({ 
  providers, 
  onConnect, 
  onDisconnect, 
  onRefresh 
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8">
        <FitnessIntegrations 
          providers={providers}
          onConnect={onConnect}
          onDisconnect={onDisconnect}
          onRefresh={onRefresh}
        />
      </div>
      
      <div className="lg:col-span-4">
        <HealthDataPrivacy />
        <SupportedDevices />
      </div>
    </div>
  );
};

export default IntegrationsTab;
