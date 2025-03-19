
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { FitnessProvider } from '@/components/dashboard/FitnessIntegrations';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';

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
  const [providers, setProviders] = useState<FitnessProvider[]>([]);
  const [fitnessData, setFitnessData] = useState<FitnessData>({});
  const { user } = useAuth();
  
  // Check for connected providers in Supabase when component mounts
  useEffect(() => {
    const fetchConnectedProviders = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        // Try to get fitness connections from Supabase
        const { data: connections, error } = await supabase
          .from('fitness_connections')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) {
          console.error('Error fetching fitness connections:', error);
          setMockProviders();
          return;
        }
        
        if (connections && connections.length > 0) {
          // Update providers with connection status
          const updatedProviders = getMockProviders().map(provider => {
            const connection = connections.find(c => c.provider === provider.id);
            if (connection) {
              return {
                ...provider,
                isConnected: true,
                lastSync: new Date(connection.last_sync || connection.updated_at).toLocaleTimeString()
              };
            }
            return provider;
          });
          
          setProviders(updatedProviders);
          
          // Fetch data for connected providers
          connections.forEach(async connection => {
            if (connection.provider === 'google_fit') {
              await fetchGoogleFitData(connection);
            }
          });
        } else {
          setMockProviders();
        }
      } catch (e) {
        console.error('Error in fetchConnectedProviders:', e);
        setMockProviders();
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchConnectedProviders();
  }, [user]);
  
  const setMockProviders = () => {
    setProviders(getMockProviders());
    setIsLoading(false);
  };
  
  const getMockProviders = (): FitnessProvider[] => {
    return [
      {
        id: 'google_fit',
        name: 'Google Fit',
        logo: '/lovable-uploads/ac216bba-3494-4854-b6f4-362893358214.png',
        isConnected: false,
        metrics: ['Heart Rate', 'Steps', 'Calories', 'Activity'],
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
  };
  
  const fetchGoogleFitData = async (connection: any) => {
    if (!user) return;
    
    try {
      // Call our Edge Function to fetch Google Fit data
      const response = await fetch('/api/fetch-google-fit-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          accessToken: connection.access_token,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch Google Fit data');
      }
      
      const data = await response.json();
      
      // Update fitness data
      setFitnessData(prev => ({
        ...prev,
        heartRate: {
          name: 'Heart Rate',
          value: data.heartRate || 72,
          unit: 'bpm',
          timestamp: new Date().toISOString(),
          change: data.heartRateChange || -3,
          source: 'Google Fit'
        },
        steps: {
          name: 'Steps',
          value: data.steps || 8524,
          unit: 'steps',
          timestamp: new Date().toISOString(),
          change: data.stepsChange || 12,
          source: 'Google Fit'
        },
        calories: {
          name: 'Calories',
          value: data.calories || 1250,
          unit: 'kcal',
          timestamp: new Date().toISOString(),
          change: data.caloriesChange || 5,
          source: 'Google Fit'
        }
      }));
      
      // Update last sync time
      updateProviderLastSync('google_fit');
      
    } catch (error) {
      console.error('Error fetching Google Fit data:', error);
    }
  };
  
  const updateProviderLastSync = (providerId: string) => {
    setProviders(prev => 
      prev.map(provider => 
        provider.id === providerId 
          ? { ...provider, lastSync: new Date().toLocaleTimeString() } 
          : provider
      )
    );
  };

  const connectProvider = async (providerId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // For Google Fit, we'll handle this specially
      if (providerId === 'google_fit') {
        // This is handled by the GoogleFitConnect component
        return true;
      }
      
      // For other mock providers
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

      // Mock data for each provider
      if (providerId === 'samsung_health') {
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
    } catch (error) {
      console.error('Error connecting provider', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectProvider = async (providerId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (providerId === 'google_fit' && user) {
        // Delete the connection from Supabase
        const { error } = await supabase
          .from('fitness_connections')
          .delete()
          .eq('user_id', user.id)
          .eq('provider', 'google_fit');
          
        if (error) {
          console.error('Error disconnecting Google Fit:', error);
          return false;
        }
      } else {
        // For mock providers
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
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
    } catch (error) {
      console.error('Error disconnecting provider', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProviderData = async (providerId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (providerId === 'google_fit' && user) {
        // Get the Google Fit connection
        const { data: connections, error } = await supabase
          .from('fitness_connections')
          .select('*')
          .eq('user_id', user.id)
          .eq('provider', 'google_fit');
          
        if (error || !connections || connections.length === 0) {
          console.error('Error fetching Google Fit connection:', error);
          return false;
        }
        
        await fetchGoogleFitData(connections[0]);
      } else {
        // For mock providers
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        updateProviderLastSync(providerId);
      }

      return true;
    } catch (error) {
      console.error('Error refreshing provider data', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Setup real-time sync for Google Fit data (every 30 seconds)
  useEffect(() => {
    if (!user) return;
    
    const syncInterval = setInterval(async () => {
      const connectedGoogleFit = providers.find(p => p.id === 'google_fit' && p.isConnected);
      if (connectedGoogleFit) {
        try {
          await refreshProviderData('google_fit');
        } catch (error) {
          console.error('Error in automatic sync:', error);
        }
      }
    }, 30000); // 30 seconds
    
    return () => clearInterval(syncInterval);
  }, [providers, user]);

  return {
    isLoading,
    providers,
    fitnessData,
    connectProvider,
    disconnectProvider,
    refreshProviderData
  };
};

export default useFitnessIntegration;
