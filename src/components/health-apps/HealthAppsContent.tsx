
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ErrorBoundaryWithFallback } from '@/pages/dashboard/components/tabs/overview/ErrorBoundaryWithFallback';
import HealthAppHeader from '@/components/health-apps/HealthAppHeader';
import IntegrationsTabContent from '@/components/health-apps/IntegrationsTabContent';
import GoogleFitTabContent from '@/components/health-apps/GoogleFitTabContent';
import DeviceTabContent from '@/components/health-apps/DeviceTabContent';
import { FitnessProvider } from '@/components/dashboard/FitnessIntegrations';
import useFitnessIntegration from '@/hooks/useFitnessIntegration';

const HealthAppsContent: React.FC = () => {
  const { 
    providers, 
    connectProvider, 
    disconnectProvider, 
    refreshProviderData 
  } = useFitnessIntegration();
  
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("integrations");
  const [connectedDevices, setConnectedDevices] = useState<string[]>([]);

  // Get list of connected providers for creating device-specific tabs
  useEffect(() => {
    const connected = providers
      .filter(p => p.isConnected)
      .map(p => p.id);
    
    setConnectedDevices(connected);
  }, [providers]);

  const handleHealthDataSync = (data: any) => {
    // This function will be called when health data is synced
    toast({
      title: "Health Data Synced",
      description: "Your health data has been synchronized",
      duration: 3000,
    });
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const getProviderById = (id: string) => {
    return providers.find(p => p.id === id);
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6">
      <HealthAppHeader />

      <ErrorBoundaryWithFallback onRetry={handleRetry}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="overflow-x-auto flex w-full sm:w-auto pb-1">
            <TabsTrigger value="integrations">All Integrations</TabsTrigger>
            {connectedDevices.includes('google_fit') && (
              <TabsTrigger value="google_fit">Google Fit</TabsTrigger>
            )}
            {connectedDevices.includes('samsung_health') && (
              <TabsTrigger value="samsung_health">Samsung Health</TabsTrigger>
            )}
            {connectedDevices.includes('apple_health') && (
              <TabsTrigger value="apple_health">Apple Health</TabsTrigger>
            )}
            {connectedDevices.includes('fitbit') && (
              <TabsTrigger value="fitbit">Fitbit</TabsTrigger>
            )}
          </TabsList>
        
          <TabsContent value="integrations" className="mt-0">
            <IntegrationsTabContent 
              providers={providers}
              onConnect={connectProvider}
              onDisconnect={disconnectProvider}
              onRefresh={refreshProviderData}
            />
          </TabsContent>
          
          <TabsContent value="google_fit" className="mt-0">
            <GoogleFitTabContent onHealthDataSync={handleHealthDataSync} />
          </TabsContent>

          {/* Dynamically generate tabs for other connected devices */}
          {connectedDevices
            .filter(id => id !== 'google_fit') // Google Fit has its own dedicated component
            .map(deviceId => {
              const provider = getProviderById(deviceId);
              return provider ? (
                <TabsContent key={deviceId} value={deviceId} className="mt-0">
                  <DeviceTabContent 
                    provider={provider}
                    onHealthDataSync={handleHealthDataSync}
                  />
                </TabsContent>
              ) : null;
            })}
        </Tabs>
      </ErrorBoundaryWithFallback>
    </main>
  );
};

export default HealthAppsContent;
