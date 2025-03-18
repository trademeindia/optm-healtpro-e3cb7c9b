
import React from 'react';
import DeviceSyncPanel from '@/components/integrations/DeviceSyncPanel';
import DeviceIntegrationInfo from '@/components/health-apps/DeviceIntegrationInfo';
import { FitnessProvider } from '@/components/dashboard/FitnessIntegrations';

interface DeviceTabContentProps {
  provider: FitnessProvider;
  onHealthDataSync: (data: any) => void;
}

const DeviceTabContent: React.FC<DeviceTabContentProps> = ({ provider, onHealthDataSync }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8">
        <DeviceSyncPanel 
          provider={provider}
          onHealthDataSync={onHealthDataSync}
          className="shadow-sm"
        />
      </div>
      
      <div className="lg:col-span-4">
        <DeviceIntegrationInfo provider={provider} />
      </div>
    </div>
  );
};

export default DeviceTabContent;
