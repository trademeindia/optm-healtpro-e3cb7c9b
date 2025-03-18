
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import useFitnessIntegration from '@/hooks/useFitnessIntegration';
import { useToast } from '@/hooks/use-toast';
import { TabsContent } from '@/components/ui/tabs';
import HealthAppsHeader from '@/components/health-apps/HealthAppsHeader';
import IntegrationsTab from '@/components/health-apps/IntegrationsTab';
import GoogleFitTab from '@/components/health-apps/GoogleFitTab';

const HealthAppsPage: React.FC = () => {
  const { 
    providers, 
    connectProvider, 
    disconnectProvider, 
    refreshProviderData 
  } = useFitnessIntegration();
  
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("integrations");

  const handleHealthDataSync = (data: any) => {
    // This function will be called when Google Fit data is synced
    toast({
      title: "Health Data Synced",
      description: "Your Google Fit data has been synchronized",
      duration: 3000,
    });
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <HealthAppsHeader activeTab={activeTab} onTabChange={setActiveTab} />

          <TabsContent value="integrations" className="mt-0">
            <IntegrationsTab 
              providers={providers}
              onConnect={connectProvider}
              onDisconnect={disconnectProvider}
              onRefresh={refreshProviderData}
            />
          </TabsContent>
          
          <TabsContent value="googlefit" className="mt-0">
            <GoogleFitTab onHealthDataSync={handleHealthDataSync} />
          </TabsContent>
        </main>
      </div>
    </div>
  );
};

export default HealthAppsPage;
