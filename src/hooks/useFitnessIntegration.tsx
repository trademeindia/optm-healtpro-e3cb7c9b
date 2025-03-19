
import { useState, useEffect } from 'react';

export interface FitnessProvider {
  id: string;
  name: string;
  logo?: string;
  isConnected: boolean;
  lastSynced?: string;
  metrics?: {
    steps: number;
    calories: number;
    heartRate: number;
    distance: number;
  };
}

export interface FitnessData {
  steps: {
    data: Array<{ timestamp: string; value: number }>;
    summary: { total: number; average: number };
  };
  heartRate: {
    data: Array<{ timestamp: string; value: number }>;
    summary: { average: number; min: number; max: number };
  };
  calories: {
    data: Array<{ timestamp: string; value: number }>;
    summary: { total: number; average: number };
  };
}

const useFitnessIntegration = () => {
  const [providers, setProviders] = useState<FitnessProvider[]>([
    {
      id: 'google-fit',
      name: 'Google Fit',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Google_Fit_icon_%282018%29.svg',
      isConnected: false,
      lastSynced: '',
      metrics: {
        steps: 0,
        calories: 0,
        heartRate: 0,
        distance: 0,
      }
    },
    {
      id: 'apple-health',
      name: 'Apple Health',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Apple_Health_Icon.png',
      isConnected: false,
      lastSynced: '',
      metrics: {
        steps: 0,
        calories: 0,
        heartRate: 0,
        distance: 0,
      }
    },
    {
      id: 'fitbit',
      name: 'Fitbit',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Fitbit_logo.svg',
      isConnected: false,
      lastSynced: '',
      metrics: {
        steps: 0,
        calories: 0,
        heartRate: 0,
        distance: 0,
      }
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [fitnessData, setFitnessData] = useState<FitnessData>({
    steps: {
      data: Array.from({ length: 7 }, (_, i) => ({
        timestamp: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString(),
        value: Math.floor(Math.random() * 5000) + 3000
      })),
      summary: { total: 0, average: 0 }
    },
    heartRate: {
      data: Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toISOString(),
        value: Math.floor(Math.random() * 20) + 60
      })),
      summary: { average: 0, min: 0, max: 0 }
    },
    calories: {
      data: Array.from({ length: 7 }, (_, i) => ({
        timestamp: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString(),
        value: Math.floor(Math.random() * 500) + 1500
      })),
      summary: { total: 0, average: 0 }
    }
  });

  // Calculate summary stats on mount or when data changes
  useEffect(() => {
    // Calculate steps summary
    const stepsTotal = fitnessData.steps.data.reduce((sum, item) => sum + item.value, 0);
    const stepsAverage = stepsTotal / fitnessData.steps.data.length || 0;
    
    // Calculate heart rate summary
    const heartRates = fitnessData.heartRate.data.map(item => item.value);
    const heartRateAverage = heartRates.reduce((sum, val) => sum + val, 0) / heartRates.length || 0;
    const heartRateMin = Math.min(...heartRates);
    const heartRateMax = Math.max(...heartRates);
    
    // Calculate calories summary
    const caloriesTotal = fitnessData.calories.data.reduce((sum, item) => sum + item.value, 0);
    const caloriesAverage = caloriesTotal / fitnessData.calories.data.length || 0;
    
    setFitnessData(prev => ({
      ...prev,
      steps: {
        ...prev.steps,
        summary: { total: stepsTotal, average: stepsAverage }
      },
      heartRate: {
        ...prev.heartRate,
        summary: { average: heartRateAverage, min: heartRateMin, max: heartRateMax }
      },
      calories: {
        ...prev.calories,
        summary: { total: caloriesTotal, average: caloriesAverage }
      }
    }));
  }, []);

  // Simulates connecting to a provider
  const connectProvider = async (providerId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setProviders(prevProviders => 
        prevProviders.map(provider => 
          provider.id === providerId 
            ? { 
                ...provider, 
                isConnected: true, 
                lastSynced: new Date().toISOString(),
                metrics: {
                  steps: Math.floor(Math.random() * 5000) + 3000,
                  calories: Math.floor(Math.random() * 500) + 1500,
                  heartRate: Math.floor(Math.random() * 20) + 60,
                  distance: Math.floor(Math.random() * 5) + 2,
                }
              } 
            : provider
        )
      );
      return true;
    } catch (error) {
      console.error('Error connecting provider:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Simulates disconnecting from a provider
  const disconnectProvider = async (providerId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProviders(prevProviders => 
        prevProviders.map(provider => 
          provider.id === providerId 
            ? { 
                ...provider, 
                isConnected: false,
                lastSynced: '',
                metrics: {
                  steps: 0,
                  calories: 0,
                  heartRate: 0,
                  distance: 0,
                }
              } 
            : provider
        )
      );
      return true;
    } catch (error) {
      console.error('Error disconnecting provider:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Simulates refreshing data from a provider
  const refreshProviderData = async (providerId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setProviders(prevProviders => 
        prevProviders.map(provider => 
          provider.id === providerId && provider.isConnected
            ? { 
                ...provider, 
                lastSynced: new Date().toISOString(),
                metrics: {
                  steps: Math.floor(Math.random() * 5000) + 3000,
                  calories: Math.floor(Math.random() * 500) + 1500,
                  heartRate: Math.floor(Math.random() * 20) + 60,
                  distance: Math.floor(Math.random() * 5) + 2,
                }
              } 
            : provider
        )
      );
      
      // Also update the detailed fitness data
      setFitnessData(prev => {
        // Generate new step data
        const newStepsData = prev.steps.data.map((item, index) => ({
          timestamp: item.timestamp,
          value: Math.floor(Math.random() * 5000) + 3000
        }));
        
        // Generate new heart rate data
        const newHeartRateData = prev.heartRate.data.map((item, index) => ({
          timestamp: item.timestamp,
          value: Math.floor(Math.random() * 20) + 60
        }));
        
        // Generate new calorie data
        const newCaloriesData = prev.calories.data.map((item, index) => ({
          timestamp: item.timestamp,
          value: Math.floor(Math.random() * 500) + 1500
        }));
        
        return {
          steps: {
            data: newStepsData,
            summary: prev.steps.summary
          },
          heartRate: {
            data: newHeartRateData,
            summary: prev.heartRate.summary
          },
          calories: {
            data: newCaloriesData,
            summary: prev.calories.summary
          }
        };
      });
      
      return true;
    } catch (error) {
      console.error('Error refreshing provider data:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Refreshes data for all connected providers
  const refreshProviders = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const connectedProviders = providers.filter(provider => provider.isConnected);
      for (const provider of connectedProviders) {
        await refreshProviderData(provider.id);
      }
      return true;
    } catch (error) {
      console.error('Error refreshing providers:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    providers,
    fitnessData,
    isLoading,
    connectProvider,
    disconnectProvider,
    refreshProviderData,
    refreshProviders
  };
};

export default useFitnessIntegration;
