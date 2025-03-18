
import React from 'react';
import FitnessIntegrations from '@/components/dashboard/FitnessIntegrations';
import PrivacyPanel from '@/components/health-apps/PrivacyPanel';
import SupportedDevicesPanel from '@/components/health-apps/SupportedDevicesPanel';
import { FitnessProvider } from '@/components/dashboard/FitnessIntegrations';

interface IntegrationsTabContentProps {
  providers: FitnessProvider[];
  onConnect: (providerId: string) => Promise<boolean>;
  onDisconnect: (providerId: string) => Promise<boolean>;
  onRefresh: (providerId: string) => Promise<boolean>;
}

const IntegrationsTabContent: React.FC<IntegrationsTabContentProps> = ({
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
        <PrivacyPanel />
        <SupportedDevicesPanel />
      </div>
    </div>
  );
};

export default IntegrationsTabContent;
