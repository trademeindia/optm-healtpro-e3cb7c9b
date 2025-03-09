
import { useToast } from '@/hooks/use-toast';
import { FitnessProvider } from '@/types/medicalData';

export const useDataSync = (
  providers: FitnessProvider[],
  refreshProviderData: (providerId: string) => Promise<void>
) => {
  const { toast } = useToast();

  // Function to handle sync of all health data
  const handleSyncAllData = async () => {
    const connectedProviders = providers.filter(p => p.isConnected);
    if (connectedProviders.length === 0) {
      toast({
        title: "No connected apps",
        description: "Please connect a health app to sync data.",
      });
      return;
    }

    toast({
      title: "Syncing data",
      description: "Syncing data from all connected health apps...",
    });

    // Sync data from all connected providers
    for (const provider of connectedProviders) {
      try {
        await refreshProviderData(provider.id);
      } catch (error) {
        console.error(`Error syncing data from provider ${provider.id}:`, error);
      }
    }

    toast({
      title: "Sync complete",
      description: "Your health data has been updated.",
    });
  };

  const hasConnectedApps = providers.some(p => p.isConnected);

  return {
    handleSyncAllData,
    hasConnectedApps
  };
};
