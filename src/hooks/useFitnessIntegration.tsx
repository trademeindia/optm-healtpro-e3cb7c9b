
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface FitnessProvider {
  id: string;
  name: string;
  isConnected: boolean;
  lastSync?: Date | null;
  logo?: string;
}

const useFitnessIntegration = () => {
  const [providers, setProviders] = useState<FitnessProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
            logo: '/assets/google-fit.svg'
          },
          {
            id: 'apple_health',
            name: 'Apple Health',
            isConnected: false,
            lastSync: null,
            logo: '/assets/apple-health.svg'
          },
          {
            id: 'fitbit',
            name: 'Fitbit',
            isConnected: false,
            lastSync: null,
            logo: '/assets/fitbit.svg'
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
          logo: '/assets/google-fit.svg'
        },
        {
          id: 'apple_health',
          name: 'Apple Health',
          isConnected: !!connectedProviders['apple_health'],
          lastSync: connectedProviders['apple_health']?.lastSync || null,
          logo: '/assets/apple-health.svg'
        },
        {
          id: 'fitbit',
          name: 'Fitbit',
          isConnected: !!connectedProviders['fitbit'],
          lastSync: connectedProviders['fitbit']?.lastSync || null,
          logo: '/assets/fitbit.svg'
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

  useEffect(() => {
    fetchConnectedProviders();
  }, [fetchConnectedProviders]);

  const connectProvider = async (providerId: string) => {
    if (!user) {
      toast.error('You must be logged in to connect a provider');
      return;
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
      return;
    }

    try {
      setIsLoading(true);
      if (providerId === 'google_fit') {
        // Redirect to Google Fit auth page
        const functionUrl = `${import.meta.env.VITE_SUPABASE_URL || "https://xjxxuqqyjqzgmvtgrpgv.supabase.co"}/functions/v1/connect-google-fit`;
        localStorage.setItem('healthAppRedirectUrl', window.location.href);
        window.location.href = `${functionUrl}?userId=${user.id}`;
      } else {
        toast.info('This provider is not yet supported');
      }
    } catch (error) {
      console.error('Error connecting provider:', error);
      toast.error(`Failed to connect ${providerId.replace('_', ' ')}`);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectProvider = async (providerId: string) => {
    if (!user) {
      toast.error('You must be logged in to disconnect a provider');
      return;
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
      return;
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
    } catch (error) {
      console.error('Error disconnecting provider:', error);
      toast.error(`Failed to disconnect ${providerId.replace('_', ' ')}`);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProviderData = async (providerId: string) => {
    if (!user) {
      toast.error('You must be logged in to refresh data');
      return;
    }

    // For demo users, simulate refresh
    if (user.id.startsWith('demo-')) {
      // Simulate loading
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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
      return;
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

      // Fetch the updated providers
      await fetchConnectedProviders();
      
      toast.success(`${providerId.replace('_', ' ')} data refreshed successfully`);
    } catch (error) {
      console.error('Error refreshing provider data:', error);
      toast.error(`Failed to refresh ${providerId.replace('_', ' ')} data`);
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
    refreshProviders: fetchConnectedProviders
  };
};

export default useFitnessIntegration;
