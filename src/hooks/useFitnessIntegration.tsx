
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export interface FitnessProvider {
  id: string;
  name: string;
  isConnected: boolean;
  lastSync?: Date | null;
  logo?: string;
  metrics: string[]; // Add the required metrics property
}

export interface FitnessData {
  steps: { 
    data: Array<{timestamp: string; value: number}>;
    lastSync: Date | null;
  };
  heartRate: { 
    data: Array<{timestamp: string; value: number}>;
    lastSync: Date | null;
  };
  sleep: { 
    data: Array<{timestamp: string; value: number}>;
    lastSync: Date | null;
  };
  calories: { 
    data: Array<{timestamp: string; value: number}>;
    lastSync: Date | null;
  };
}

const useFitnessIntegration = () => {
  const [providers, setProviders] = useState<FitnessProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fitnessData, setFitnessData] = useState<FitnessData>({
    steps: { data: [], lastSync: null },
    heartRate: { data: [], lastSync: null },
    sleep: { data: [], lastSync: null },
    calories: { data: [], lastSync: null }
  });
  const { user } = useAuth();

  const fetchConnectedProviders = useCallback(async () => {
    if (!user?.id) {
      setProviders([]);
      setIsLoading(false);
      return;
    }

    try {
      // For demo users, return mock data
      if (user.id.startsWith('demo-')) {
        const mockProviders: FitnessProvider[] = [
          {
            id: 'google_fit',
            name: 'Google Fit',
            isConnected: user.id.includes('patient'),
            lastSync: user.id.includes('patient') ? new Date(Date.now() - 24 * 60 * 60 * 1000) : null,
            logo: '/assets/google-fit.svg',
            metrics: ['steps', 'activity', 'heart_rate'] // Add default metrics
          },
          {
            id: 'apple_health',
            name: 'Apple Health',
            isConnected: false,
            lastSync: null,
            logo: '/assets/apple-health.svg',
            metrics: ['steps', 'activity', 'heart_rate']
          },
          {
            id: 'fitbit',
            name: 'Fitbit',
            isConnected: false,
            lastSync: null,
            logo: '/assets/fitbit.svg',
            metrics: ['steps', 'activity', 'sleep']
          }
        ];
        setProviders(mockProviders);
        setIsLoading(false);
        return;
      }

      // Query the database for real user connections
      const { data, error } = await supabase
        .from('fitness_connections')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      // Map connections to provider data
      const connectedProviders = (data || []).reduce((acc: Record<string, any>, conn) => {
        acc[conn.provider] = {
          isConnected: true,
          lastSync: conn.last_sync ? new Date(conn.last_sync) : null
        };
        return acc;
      }, {});

      // Merge with all available providers
      const allProviders: FitnessProvider[] = [
        {
          id: 'google_fit',
          name: 'Google Fit',
          isConnected: !!connectedProviders['google_fit'],
          lastSync: connectedProviders['google_fit']?.lastSync || null,
          logo: '/assets/google-fit.svg',
          metrics: ['steps', 'heart_rate', 'calories'] // Add metrics
        },
        {
          id: 'apple_health',
          name: 'Apple Health',
          isConnected: !!connectedProviders['apple_health'],
          lastSync: connectedProviders['apple_health']?.lastSync || null,
          logo: '/assets/apple-health.svg',
          metrics: ['steps', 'heart_rate', 'sleep'] // Add metrics
        },
        {
          id: 'fitbit',
          name: 'Fitbit',
          isConnected: !!connectedProviders['fitbit'],
          lastSync: connectedProviders['fitbit']?.lastSync || null,
          logo: '/assets/fitbit.svg',
          metrics: ['steps', 'activity', 'sleep'] // Add metrics
        }
      ];

      setProviders(allProviders);
    } catch (error) {
      console.error('Error fetching fitness connections:', error);
      toast.error('Failed to load fitness integrations');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Add a function to fetch fitness data from a provider
  const fetchProviderData = useCallback(async (providerId: string): Promise<boolean> => {
    if (!user?.id) return false;
    
    // For demo users, generate mock data
    if (user.id.startsWith('demo-')) {
      setFitnessData(prev => {
        // Generate random steps data for the last 7 days
        const stepsData = Array(7).fill(0).map((_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - 6 + i);
          return {
            timestamp: date.toISOString(),
            value: 5000 + Math.floor(Math.random() * 5000) // Random steps between 5000-10000
          };
        });
        
        // Generate random heart rate data
        const heartRateData = Array(24).fill(0).map((_, i) => {
          const date = new Date();
          date.setHours(date.getHours() - 23 + i);
          return {
            timestamp: date.toISOString(),
            value: 60 + Math.floor(Math.random() * 40) // Random HR between 60-100
          };
        });
        
        // Mock calorie data
        const caloriesData = Array(7).fill(0).map((_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - 6 + i);
          return {
            timestamp: date.toISOString(),
            value: 1800 + Math.floor(Math.random() * 800) // Random calories between 1800-2600
          };
        });
        
        return {
          steps: { data: stepsData, lastSync: new Date() },
          heartRate: { data: heartRateData, lastSync: new Date() },
          calories: { data: caloriesData, lastSync: new Date() },
          sleep: prev.sleep // Keep existing sleep data
        };
      });
      
      return true;
    }
    
    try {
      // For real implementation, fetch data from Supabase Edge Function
      if (providerId === 'google_fit') {
        const { data, error } = await supabase
          .from('fitness_data')
          .select('*')
          .eq('user_id', user.id)
          .eq('source', 'google_fit')
          .order('start_time', { ascending: false });
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Process and transform the data
          const stepsData = data
            .filter(item => item.data_type === 'steps')
            .map(item => ({
              timestamp: item.start_time,
              value: item.value
            }));
            
          const heartRateData = data
            .filter(item => item.data_type === 'heart_rate')
            .map(item => ({
              timestamp: item.start_time,
              value: item.value
            }));
            
          const caloriesData = data
            .filter(item => item.data_type === 'calories')
            .map(item => ({
              timestamp: item.start_time,
              value: item.value
            }));
            
          setFitnessData({
            steps: { 
              data: stepsData,
              lastSync: new Date()
            },
            heartRate: { 
              data: heartRateData,
              lastSync: new Date()
            },
            calories: { 
              data: caloriesData,
              lastSync: new Date()
            },
            sleep: { 
              data: [], // Not implemented yet
              lastSync: null
            }
          });
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error fetching provider data:', error);
      return false;
    }
  }, [user?.id]);

  useEffect(() => {
    fetchConnectedProviders();
  }, [fetchConnectedProviders]);

  // Update the return types of these functions to return boolean values
  const connectProvider = async (providerId: string): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to connect a provider');
      return false;
    }

    // For demo users, simulate connection
    if (user.id.startsWith('demo-')) {
      // Simulate loading
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the provider state
      setProviders(prev => 
        prev.map(provider => 
          provider.id === providerId 
            ? { ...provider, isConnected: true, lastSync: new Date() } 
            : provider
        )
      );
      
      toast.success(`Demo ${providerId.replace('_', ' ')} connected successfully`);
      setIsLoading(false);
      
      // Generate mock data for the newly connected provider
      await fetchProviderData(providerId);
      
      return true;
    }

    try {
      setIsLoading(true);
      if (providerId === 'google_fit') {
        // Redirect to Google Fit auth page
        const functionUrl = `${import.meta.env.VITE_SUPABASE_URL || "https://xjxxuqqyjqzgmvtgrpgv.supabase.co"}/functions/v1/connect-google-fit`;
        localStorage.setItem('healthAppRedirectUrl', window.location.href);
        window.location.href = `${functionUrl}?userId=${user.id}`;
        return true;
      } else {
        toast.info('This provider is not yet supported');
        return false;
      }
    } catch (error) {
      console.error('Error connecting provider:', error);
      toast.error(`Failed to connect ${providerId.replace('_', ' ')}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectProvider = async (providerId: string): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to disconnect a provider');
      return false;
    }

    // For demo users, simulate disconnection
    if (user.id.startsWith('demo-')) {
      // Simulate loading
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the provider state
      setProviders(prev => 
        prev.map(provider => 
          provider.id === providerId 
            ? { ...provider, isConnected: false, lastSync: null } 
            : provider
        )
      );
      
      toast.success(`Demo ${providerId.replace('_', ' ')} disconnected successfully`);
      setIsLoading(false);
      return true;
    }

    try {
      setIsLoading(true);
      // Delete the connection from the database
      const { error } = await supabase
        .from('fitness_connections')
        .delete()
        .eq('user_id', user.id)
        .eq('provider', providerId);

      if (error) throw error;

      // Update the state
      setProviders(prev => 
        prev.map(provider => 
          provider.id === providerId 
            ? { ...provider, isConnected: false, lastSync: null } 
            : provider
        )
      );
      
      toast.success(`${providerId.replace('_', ' ')} disconnected successfully`);
      return true;
    } catch (error) {
      console.error('Error disconnecting provider:', error);
      toast.error(`Failed to disconnect ${providerId.replace('_', ' ')}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProviderData = async (providerId: string): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to refresh data');
      return false;
    }

    // For demo users, simulate refresh
    if (user.id.startsWith('demo-')) {
      // Simulate loading
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Fetch new mock data
      await fetchProviderData(providerId);
      
      // Update the provider state with a new sync time
      setProviders(prev => 
        prev.map(provider => 
          provider.id === providerId 
            ? { ...provider, lastSync: new Date() } 
            : provider
        )
      );
      
      toast.success(`Demo ${providerId.replace('_', ' ')} data refreshed`);
      setIsLoading(false);
      return true;
    }

    try {
      setIsLoading(true);
      toast.info(`Refreshing ${providerId.replace('_', ' ')} data...`);
      
      // Call the sync function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL || "https://xjxxuqqyjqzgmvtgrpgv.supabase.co"}/functions/v1/fetch-google-fit-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          provider: providerId,
          forceRefresh: true
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to refresh data');
      }

      // Update the provider's last sync time
      const { error } = await supabase
        .from('fitness_connections')
        .update({ last_sync: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('provider', providerId);

      if (error) throw error;

      // Fetch the updated providers and data
      await fetchConnectedProviders();
      await fetchProviderData(providerId);
      
      toast.success(`${providerId.replace('_', ' ')} data refreshed successfully`);
      return true;
    } catch (error) {
      console.error('Error refreshing provider data:', error);
      toast.error(`Failed to refresh ${providerId.replace('_', ' ')} data`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    providers,
    isLoading,
    connectProvider,
    disconnectProvider,
    refreshProviderData,
    refreshProviders: fetchConnectedProviders,
    fitnessData // Add the fitnessData property
  };
};

export default useFitnessIntegration;
