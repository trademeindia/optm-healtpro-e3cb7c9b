
import { useToast } from '@/hooks/use-toast';

export const useHealthSync = (
  providers: any[],
  refreshProviderData: (providerId: string) => Promise<boolean>
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
      await refreshProviderData(provider.id);
    }

    toast({
      title: "Sync complete",
      description: "Your health data has been updated.",
    });
  };

  return {
    handleSyncAllData
  };
};
