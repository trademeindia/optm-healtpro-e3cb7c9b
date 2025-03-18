import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { FitnessProvider } from '@/components/dashboard/FitnessIntegrations';

interface HealthMetric {
  name: string;
  value: number | string;
  unit: string;
  timestamp: string;
  change?: number;
  source: string;
}

export interface FitnessData {
  heartRate?: HealthMetric;
  steps?: HealthMetric;
  calories?: HealthMetric;
  bloodPressure?: HealthMetric;
  temperature?: HealthMetric;
  oxygenSaturation?: HealthMetric;
  [key: string]: HealthMetric | undefined;
}

const useFitnessIntegration = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [providers, setProviders] = useState<FitnessProvider[]>([]);
  const [fitnessData, setFitnessData] = useState<FitnessData>({});

  useEffect(() => {
    const mockProviders: FitnessProvider[] = [
      {
        id: 'google_fit',
        name: 'Google Fit',
        logo: '/lovable-uploads/ac216bba-3494-4854-b6f4-362893358214.png',
        isConnected: false,
        metrics: ['Heart Rate', 'Steps', 'Calories', 'Blood Pressure'],
      },
      {
        id: 'samsung_health',
        name: 'Samsung Health',
        logo: 'https://via.placeholder.com/24?text=SH',
        isConnected: false,
        metrics: ['Heart Rate', 'Steps', 'Calories', 'Sleep'],
      },
      {
        id: 'apple_health',
        name: 'Apple Health',
        logo: 'https://via.placeholder.com/24?text=AH',
        isConnected: false,
        metrics: ['Heart Rate', 'Steps', 'Calories', 'Blood Pressure', 'Oxygen'],
      },
      {
        id: 'fitbit',
        name: 'Fitbit',
        logo: 'https://via.placeholder.com/24?text=FB',
        isConnected: false,
        metrics: ['Heart Rate', 'Steps', 'Calories', 'Sleep'],
      }
    ];

    setProviders(mockProviders);
    setIsLoading(false);
  }, []);

  const connectProvider = async (providerId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setProviders(prev => 
        prev.map(provider => 
          provider.id === providerId 
            ? { 
                ...provider, 
                isConnected: true, 
                lastSync: new Date().toLocaleTimeString() 
              } 
            : provider
        )
      );

      if (providerId === 'google_fit') {
        setFitnessData(prev => ({
          ...prev,
          heartRate: {
            name: 'Heart Rate',
            value: 72,
            unit: 'bpm',
            timestamp: new Date().toISOString(),
            change: -3,
            source: 'Google Fit'
          },
          steps: {
            name: 'Steps',
            value: 8524,
            unit: 'steps',
            timestamp: new Date().toISOString(),
            change: 12,
            source: 'Google Fit'
          },
          calories: {
            name: 'Calories',
            value: 1250,
            unit: 'kcal',
            timestamp: new Date().toISOString(),
            change: 5,
            source: 'Google Fit'
          },
          bloodPressure: {
            name: 'Blood Pressure',
            value: '120/80',
            unit: 'mmHg',
            timestamp: new Date().toISOString(),
            source: 'Google Fit'
          }
        }));
      } else if (providerId === 'samsung_health') {
        setFitnessData(prev => ({
          ...prev,
          heartRate: {
            name: 'Heart Rate',
            value: 68,
            unit: 'bpm',
            timestamp: new Date().toISOString(),
            change: -8,
            source: 'Samsung Health'
          },
          steps: {
            name: 'Steps',
            value: 9120,
            unit: 'steps',
            timestamp: new Date().toISOString(),
            change: 15,
            source: 'Samsung Health'
          },
          calories: {
            name: 'Calories',
            value: 1380,
            unit: 'kcal',
            timestamp: new Date().toISOString(),
            change: 8,
            source: 'Samsung Health'
          }
        }));
      } else if (providerId === 'apple_health') {
        setFitnessData(prev => ({
          ...prev,
          heartRate: {
            name: 'Heart Rate',
            value: 70,
            unit: 'bpm',
            timestamp: new Date().toISOString(),
            change: -5,
            source: 'Apple Health'
          },
          steps: {
            name: 'Steps',
            value: 8950,
            unit: 'steps',
            timestamp: new Date().toISOString(),
            change: 14,
            source: 'Apple Health'
          },
          bloodPressure: {
            name: 'Blood Pressure',
            value: '118/78',
            unit: 'mmHg',
            timestamp: new Date().toISOString(),
            source: 'Apple Health'
          },
          oxygenSaturation: {
            name: 'Oxygen Saturation',
            value: 98,
            unit: '%',
            timestamp: new Date().toISOString(),
            change: 1,
            source: 'Apple Health'
          }
        }));
      } else if (providerId === 'fitbit') {
        setFitnessData(prev => ({
          ...prev,
          heartRate: {
            name: 'Heart Rate',
            value: 74,
            unit: 'bpm',
            timestamp: new Date().toISOString(),
            change: 2,
            source: 'Fitbit'
          },
          steps: {
            name: 'Steps',
            value: 7890,
            unit: 'steps',
            timestamp: new Date().toISOString(),
            change: 5,
            source: 'Fitbit'
          },
          calories: {
            name: 'Calories',
            value: 1120,
            unit: 'kcal',
            timestamp: new Date().toISOString(),
            change: 3,
            source: 'Fitbit'
          }
        }));
      }

      toast.success("Successfully connected", {
        description: `Health data synced from ${providers.find(p => p.id === providerId)?.name}`,
        duration: 3000
      });

      return true;
    } catch (err) {
      console.error('Error connecting provider', err);
      setError(err instanceof Error ? err : new Error('Failed to connect provider'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectProvider = async (providerId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProviders(prev => 
        prev.map(provider => 
          provider.id === providerId 
            ? { ...provider, isConnected: false, lastSync: undefined } 
            : provider
        )
      );

      const providerName = providers.find(p => p.id === providerId)?.name || '';
      const newFitnessData = { ...fitnessData };
      
      Object.keys(newFitnessData).forEach(key => {
        if (newFitnessData[key]?.source === providerName) {
          delete newFitnessData[key];
        }
      });
      
      setFitnessData(newFitnessData);

      return true;
    } catch (err) {
      console.error('Error disconnecting provider', err);
      setError(err instanceof Error ? err : new Error('Failed to disconnect provider'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProviderData = async (providerId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setProviders(prev => 
        prev.map(provider => 
          provider.id === providerId 
            ? { ...provider, lastSync: new Date().toLocaleTimeString() } 
            : provider
        )
      );

      setFitnessData(prev => {
        const updated = { ...prev };
        const providerName = providers.find(p => p.id === providerId)?.name || '';
        
        Object.keys(updated).forEach(key => {
          if (updated[key]?.source === providerName) {
            updated[key] = {
              ...updated[key]!,
              timestamp: new Date().toISOString()
            };
          }
        });
        
        return updated;
      });

      return true;
    } catch (err) {
      console.error('Error refreshing provider data', err);
      setError(err instanceof Error ? err : new Error('Failed to refresh provider data'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    providers,
    fitnessData,
    connectProvider,
    disconnectProvider,
    refreshProviderData
  };
};

export default useFitnessIntegration;
