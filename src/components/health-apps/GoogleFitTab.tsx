
import React from 'react';
import GoogleFitSyncPanel from '@/components/integrations/GoogleFitSyncPanel';
import GoogleFitInfo from './GoogleFitInfo';

interface GoogleFitTabProps {
  onHealthDataSync: (data: any) => void;
}

const GoogleFitTab: React.FC<GoogleFitTabProps> = ({ onHealthDataSync }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8">
        <GoogleFitSyncPanel 
          onHealthDataSync={onHealthDataSync}
          className="shadow-sm"
        />
      </div>
      
      <div className="lg:col-span-4">
        <GoogleFitInfo />
      </div>
    </div>
  );
};

export default GoogleFitTab;
