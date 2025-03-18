
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import FitnessIntegrations from '@/components/dashboard/FitnessIntegrations';
import useFitnessIntegration from '@/hooks/useFitnessIntegration';
import { Button } from '@/components/ui/button';
import { Check, Smartphone, X } from 'lucide-react';
import GoogleFitSyncPanel from '@/components/integrations/GoogleFitSyncPanel';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ErrorBoundaryWithFallback } from '@/pages/dashboard/components/tabs/overview/ErrorBoundaryWithFallback';
import DeviceSyncPanel from '@/components/integrations/DeviceSyncPanel';

const HealthAppsPage: React.FC = () => {
  const { 
    providers, 
    fitnessData,
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

          <ErrorBoundaryWithFallback onRetry={handleRetry}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="overflow-x-auto flex w-full sm:w-auto pb-1">
                <TabsTrigger value="integrations">All Integrations</TabsTrigger>
                {connectedDevices.includes('google_fit') && (
                  <TabsTrigger value="googlefit">Google Fit</TabsTrigger>
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
              </TabsContent>
              
              <TabsContent value="googlefit" className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-8">
                    <GoogleFitSyncPanel 
                      onHealthDataSync={handleHealthDataSync}
                      className="shadow-sm"
                    />
                  </div>
                  
                  <div className="lg:col-span-4">
                    <div className="glass-morphism rounded-2xl p-6">
                      <h3 className="text-lg font-semibold mb-4">Google Fit Integration</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Connect your Google Fit account to track and monitor your health metrics in real-time.
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <div className="bg-primary/10 p-1.5 rounded-full mt-0.5">
                            <Check className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <p className="text-xs">
                            <span className="font-medium">Real-time syncing</span> - Get your latest fitness data instantly
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="bg-primary/10 p-1.5 rounded-full mt-0.5">
                            <Check className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <p className="text-xs">
                            <span className="font-medium">Comprehensive metrics</span> - Track steps, heart rate, sleep and more
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="bg-primary/10 p-1.5 rounded-full mt-0.5">
                            <Check className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <p className="text-xs">
                            <span className="font-medium">Historical data</span> - View your progress over time with detailed charts
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="bg-primary/10 p-1.5 rounded-full mt-0.5">
                            <Check className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <p className="text-xs">
                            <span className="font-medium">Secure connection</span> - Your data is transferred securely using OAuth 2.0
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="text-sm font-medium mb-2">Supported Devices</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-2 p-2 border rounded-md bg-card">
                            <Smartphone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs">Android Phones</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 border rounded-md bg-card">
                            <Smartphone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs">Google Pixel</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 border rounded-md bg-card">
                            <Smartphone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs">Wear OS watches</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 border rounded-md bg-card">
                            <Smartphone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs">Fitbit devices</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="glass-morphism rounded-2xl p-6 mt-6">
                      <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        If you're having trouble connecting to Google Fit or syncing your data, here are some resources to help you.
                      </p>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          Troubleshooting Guide
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          Contact Support
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          FAQ
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Dynamically generate tabs for other connected devices */}
              {connectedDevices
                .filter(id => id !== 'google_fit') // Google Fit has its own dedicated component
                .map(deviceId => {
                  const provider = getProviderById(deviceId);
                  return provider ? (
                    <TabsContent key={deviceId} value={deviceId} className="mt-0">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-8">
                          <DeviceSyncPanel 
                            provider={provider}
                            onHealthDataSync={handleHealthDataSync}
                            className="shadow-sm"
                          />
                        </div>
                        
                        <div className="lg:col-span-4">
                          <div className="glass-morphism rounded-2xl p-6">
                            <h3 className="text-lg font-semibold mb-4">{provider.name} Integration</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              Connect your {provider.name} account to track and monitor your health metrics in real-time.
                            </p>
                            <div className="space-y-3">
                              <div className="flex items-start gap-2">
                                <div className="bg-primary/10 p-1.5 rounded-full mt-0.5">
                                  <Check className="h-3.5 w-3.5 text-primary" />
                                </div>
                                <p className="text-xs">
                                  <span className="font-medium">Real-time syncing</span> - Get your latest fitness data instantly
                                </p>
                              </div>
                              <div className="flex items-start gap-2">
                                <div className="bg-primary/10 p-1.5 rounded-full mt-0.5">
                                  <Check className="h-3.5 w-3.5 text-primary" />
                                </div>
                                <p className="text-xs">
                                  <span className="font-medium">Comprehensive metrics</span> - Track steps, heart rate, sleep and more
                                </p>
                              </div>
                              <div className="flex items-start gap-2">
                                <div className="bg-primary/10 p-1.5 rounded-full mt-0.5">
                                  <Check className="h-3.5 w-3.5 text-primary" />
                                </div>
                                <p className="text-xs">
                                  <span className="font-medium">Historical data</span> - View your progress over time with detailed charts
                                </p>
                              </div>
                              <div className="flex items-start gap-2">
                                <div className="bg-primary/10 p-1.5 rounded-full mt-0.5">
                                  <Check className="h-3.5 w-3.5 text-primary" />
                                </div>
                                <p className="text-xs">
                                  <span className="font-medium">Secure connection</span> - Your data is transferred securely
                                </p>
                              </div>
                            </div>
                            
                            <div className="mt-6">
                              <h4 className="text-sm font-medium mb-2">Supported Devices</h4>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center gap-2 p-2 border rounded-md bg-card">
                                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-xs">{provider.name} Devices</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="glass-morphism rounded-2xl p-6 mt-6">
                            <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              If you're having trouble connecting to {provider.name} or syncing your data, here are some resources to help you.
                            </p>
                            <div className="space-y-2">
                              <Button variant="outline" size="sm" className="w-full justify-start">
                                Troubleshooting Guide
                              </Button>
                              <Button variant="outline" size="sm" className="w-full justify-start">
                                Contact Support
                              </Button>
                              <Button variant="outline" size="sm" className="w-full justify-start">
                                FAQ
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  ) : null;
                })}
            </Tabs>
          </ErrorBoundaryWithFallback>
        </main>
      </div>
    </div>
  );
};

export default HealthAppsPage;
