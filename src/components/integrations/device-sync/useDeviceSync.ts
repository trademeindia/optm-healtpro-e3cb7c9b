
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { FitnessProvider } from '@/components/dashboard/FitnessIntegrations';
import { FitnessData } from '@/hooks/useFitnessIntegration';

export const useDeviceSync = (
  provider: FitnessProvider, 
  onHealthDataSync?: (data: FitnessData) => void
) => {
  const [isConnected, setIsConnected] = useState<boolean>(provider.isConnected);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [healthData, setHealthData] = useState<FitnessData>({});
  const [lastSyncTime, setLastSyncTime] = useState<string | undefined>(provider.lastSync);
  const [activeTab, setActiveTab] = useState('current');

  const handleConnect = useCallback(() => {
    if (!isConnected) {
      setIsLoading(true);
      
      // Simulate connection process
      setTimeout(() => {
        setIsConnected(true);
        setLastSyncTime(new Date().toLocaleTimeString());
        
        // Generate mock health data for this provider
        const mockHealthData = generateMockHealthData(provider.name);
        setHealthData(mockHealthData);
        
        if (onHealthDataSync) {
          onHealthDataSync(mockHealthData);
        }
        
        setIsLoading(false);
        
        toast.success(`Connected to ${provider.name}`, {
          description: "Your health data is now being synced"
        });
      }, 1500);
    }
  }, [isConnected, onHealthDataSync, provider.name]);

  const handleDisconnect = useCallback(async () => {
    if (isConnected) {
      setIsLoading(true);
      
      // Simulate disconnection process
      setTimeout(() => {
        setIsConnected(false);
        setHealthData({});
        setLastSyncTime(undefined);
        
        setIsLoading(false);
        
        toast.success(`Disconnected from ${provider.name}`, {
          description: "Your health data will no longer be synced"
        });
      }, 1000);
    }
  }, [isConnected, provider.name]);

  const handleSync = useCallback(async () => {
    if (isConnected) {
      setIsLoading(true);
      
      // Simulate sync process
      setTimeout(() => {
        setLastSyncTime(new Date().toLocaleTimeString());
        
        // Update mock health data with slight variations
        const updatedHealthData = generateMockHealthData(provider.name);
        setHealthData(updatedHealthData);
        
        if (onHealthDataSync) {
          onHealthDataSync(updatedHealthData);
        }
        
        setIsLoading(false);
        
        toast.success(`Synced with ${provider.name}`, {
          description: "Your latest health data has been updated"
        });
      }, 1500);
    }
  }, [isConnected, onHealthDataSync, provider.name]);

  return {
    isConnected,
    isLoading,
    healthData,
    lastSyncTime,
    activeTab,
    setActiveTab,
    handleConnect,
    handleDisconnect,
    handleSync
  };
};

// Generate mock health data for the device
export const generateMockHealthData = (providerName: string): FitnessData => {
  const currentTimestamp = new Date().toISOString();
  
  // Generate realistic mock data specific to this provider
  return {
    heartRate: {
      name: 'Heart Rate',
      value: Math.floor(60 + Math.random() * 20), // 60-80 bpm
      unit: 'bpm',
      timestamp: currentTimestamp,
      change: Math.floor(Math.random() * 10) * (Math.random() > 0.5 ? 1 : -1),
      source: providerName
    },
    steps: {
      name: 'Steps',
      value: Math.floor(5000 + Math.random() * 7000), // 5000-12000 steps
      unit: 'steps',
      timestamp: currentTimestamp,
      change: Math.floor(Math.random() * 15) * (Math.random() > 0.3 ? 1 : -1),
      source: providerName
    },
    calories: {
      name: 'Calories',
      value: Math.floor(1000 + Math.random() * 1000), // 1000-2000 kcal
      unit: 'kcal',
      timestamp: currentTimestamp,
      change: Math.floor(Math.random() * 8) * (Math.random() > 0.4 ? 1 : -1),
      source: providerName
    },
    distance: {
      name: 'Distance',
      value: Math.floor(30 + Math.random() * 100) / 10, // 3.0-13.0 km
      unit: 'km',
      timestamp: currentTimestamp,
      change: Math.floor(Math.random() * 12),
      source: providerName
    },
    sleep: {
      name: 'Sleep',
      value: Math.floor(5 + Math.random() * 4), // 5-9 hours
      unit: 'hours',
      timestamp: currentTimestamp,
      change: Math.floor(Math.random() * 20) * (Math.random() > 0.5 ? 1 : -1),
      source: providerName
    },
    activeMinutes: {
      name: 'Active Minutes',
      value: Math.floor(30 + Math.random() * 60), // 30-90 minutes
      unit: 'min',
      timestamp: currentTimestamp,
      change: Math.floor(Math.random() * 25),
      source: providerName
    }
  };
};
