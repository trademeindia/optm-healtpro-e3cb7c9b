
import React from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import FitnessIntegrations from '@/components/dashboard/FitnessIntegrations';
import useFitnessIntegration from '@/hooks/useFitnessIntegration';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const HealthAppsPage: React.FC = () => {
  const { 
    providers, 
    connectProvider, 
    disconnectProvider, 
    refreshProviderData 
  } = useFitnessIntegration();

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-6 pl-10 lg:pl-0">
            <h1 className="text-2xl font-bold">Health Apps</h1>
            <p className="text-sm text-muted-foreground">
              Connect and manage your health and fitness applications
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <FitnessIntegrations 
                providers={providers}
                onConnect={connectProvider}
                onDisconnect={disconnectProvider}
                onRefresh={refreshProviderData}
              />
            </div>
            
            <div className="lg:col-span-4">
              <div className="glass-morphism rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">Health Data Privacy</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Your health data is secure and only accessible to you and your healthcare providers. 
                  We adhere to strict privacy regulations and use encryption to protect your information.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="bg-primary/10 p-1.5 rounded-full mt-0.5">
                      <Check className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <p className="text-xs">
                      <span className="font-medium">End-to-end encryption</span> - Your data is encrypted during transmission and storage
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="bg-primary/10 p-1.5 rounded-full mt-0.5">
                      <Check className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <p className="text-xs">
                      <span className="font-medium">OAuth 2.0</span> - Secure authentication without sharing your passwords
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="bg-primary/10 p-1.5 rounded-full mt-0.5">
                      <Check className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <p className="text-xs">
                      <span className="font-medium">HIPAA compliance</span> - We follow healthcare data protection standards
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="bg-primary/10 p-1.5 rounded-full mt-0.5">
                      <Check className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <p className="text-xs">
                      <span className="font-medium">Data minimization</span> - We only collect what's necessary for your care
                    </p>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline" size="sm">
                  Privacy Settings
                </Button>
              </div>
              
              <div className="glass-morphism rounded-2xl p-6 mt-6">
                <h3 className="text-lg font-semibold mb-4">Supported Devices</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  We support a wide range of fitness trackers and health monitoring devices.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 border rounded-lg bg-card">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-xs font-medium">Apple</span>
                    </div>
                    <p className="text-xs">Apple Watch</p>
                  </div>
                  <div className="text-center p-3 border rounded-lg bg-card">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-xs font-medium">Fitbit</span>
                    </div>
                    <p className="text-xs">Fitbit Devices</p>
                  </div>
                  <div className="text-center p-3 border rounded-lg bg-card">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-xs font-medium">G</span>
                    </div>
                    <p className="text-xs">Google Wear OS</p>
                  </div>
                  <div className="text-center p-3 border rounded-lg bg-card">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-xs font-medium">S</span>
                    </div>
                    <p className="text-xs">Samsung Devices</p>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline" size="sm">
                  View All Supported Devices
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HealthAppsPage;
