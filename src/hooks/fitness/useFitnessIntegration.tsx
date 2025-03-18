
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { FitnessData, FitnessProvider } from './types';
import { getMockProviders } from './mockProviders';
import { getProviderData } from './providerData';
import { 
  updateProviderConnection, 
  updateFitnessDataTimestamps,
  removeProviderData
} from './providerActions';

const useFitnessIntegration = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [providers, setProviders] = useState<FitnessProvider[]>([]);
  const [fitnessData, setFitnessData] = useState<FitnessData>({});

  useEffect(() => {
    const mockProviders = getMockProviders();
    setProviders(mockProviders);
    setIsLoading(false);
  }, []);

  const connectProvider = async (providerId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setProviders(prev => 
        updateProviderConnection(
          prev, 
          providerId, 
          true, 
          new Date().toLocaleTimeString()
        )
      );

      // Get provider-specific data
      const newData = getProviderData(providerId);
      
      setFitnessData(prev => ({
        ...prev,
        ...newData
      }));

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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const providerName = providers.find(p => p.id === providerId)?.name || '';
      
      setProviders(prev => 
        updateProviderConnection(prev, providerId, false)
      );
      
      setFitnessData(prev => 
        removeProviderData(prev, providerName)
      );

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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setProviders(prev => 
        updateProviderConnection(
          prev, 
          providerId, 
          true, 
          new Date().toLocaleTimeString()
        )
      );

      const providerName = providers.find(p => p.id === providerId)?.name || '';
      
      setFitnessData(prev => 
        updateFitnessDataTimestamps(prev, providerName)
      );

      return true;
    } catch (error) {
      console.error('Error refreshing provider data', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

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
