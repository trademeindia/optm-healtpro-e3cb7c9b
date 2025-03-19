
import React, { useState } from 'react';
import { useHealthData } from '@/hooks/health';
import { TimeRange } from '@/services/health';
import { 
  DashboardHeader,
  TimeRangeSelector,
  ConnectPrompt,
  DashboardContent
} from './dashboard';

interface HealthDashboardProps {
  className?: string;
}

const HealthDashboard: React.FC<HealthDashboardProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('week');
  
  const { 
    metrics, 
    metricsHistory,
    isLoading, 
    isSyncing, 
    lastSyncTime,
    hasGoogleFitConnected,
    connections,
    syncData,
    setTimeRange
  } = useHealthData({
    autoSync: true,
    syncInterval: 30000, // 30 seconds
    defaultTimeRange: selectedTimeRange
  });
  
  const handleTimeRangeChange = (range: TimeRange) => {
    setSelectedTimeRange(range);
    setTimeRange(range);
  };
  
  const handleSyncClick = async () => {
    await syncData(true);
  };
  
  return (
    <div className={className}>
      <DashboardHeader 
        hasGoogleFitConnected={hasGoogleFitConnected}
        isSyncing={isSyncing}
        onSyncClick={handleSyncClick}
      />
      
      <TimeRangeSelector
        selectedTimeRange={selectedTimeRange}
        onTimeRangeChange={handleTimeRangeChange}
      />
      
      {!hasGoogleFitConnected ? (
        <ConnectPrompt />
      ) : (
        <DashboardContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedTimeRange={selectedTimeRange}
          metrics={metrics}
          metricsHistory={metricsHistory}
          connections={connections}
          lastSyncTime={lastSyncTime}
          isLoading={isLoading}
          isSyncing={isSyncing}
          onSyncClick={handleSyncClick}
        />
      )}
    </div>
  );
};

export default HealthDashboard;
