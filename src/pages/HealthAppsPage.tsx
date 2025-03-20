
import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import FitnessIntegrations from '@/components/dashboard/FitnessIntegrations';
import useFitnessIntegration from '@/hooks/useFitnessIntegration';
import { Button } from '@/components/ui/button';
import { Check, AlertCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import GoogleFitConnect from '@/components/integrations/GoogleFitConnect';
import ComprehensiveHealthDashboard from '@/components/health-dashboard/ComprehensiveHealthDashboard';
import { useHealthData } from '@/hooks/useHealthData'; // Using the original hook
import OAuthDebugInfo from '@/components/integrations/OAuthDebugInfo';

const HealthAppsPage: React.FC = () => {
  const { 
    providers, 
    connectProvider, 
    disconnectProvider, 
    refreshProviderData 
  } = useFitnessIntegration();
  
  const {
    healthData,
    isLoading,
    error,
    lastSynced,
    syncHealthData
  } = useHealthData();
  
  const location = useLocation();
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);
  
  // Check for debug mode
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const debug = params.get('debug');
    if (debug === 'true') {
      setShowDebugInfo(true);
    }
  }, [location]);
  
  // Handle connection status from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const connected = params.get('connected');
    const error = params.get('error');
    
    if (connected === 'true') {
      toast.success('Google Fit connected successfully', {
        description: 'Your health data will now sync automatically.',
        duration: 5000
      });
      
      // Clean URL parameters but preserve debug mode if enabled
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('connected');
      if (showDebugInfo) {
        newUrl.searchParams.set('debug', 'true');
      } else {
        newUrl.searchParams.delete('debug');
      }
      window.history.replaceState({}, document.title, newUrl.toString());
    }
    
    if (error) {
      toast.error('Failed to connect Google Fit', {
        description: decodeURIComponent(error),
        duration: 8000
      });
      
      // Display debug info automatically if there's an error
      setShowDebugInfo(true);
      
      // Clean URL parameters but preserve debug mode
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('error');
      newUrl.searchParams.set('debug', 'true');
      window.history.replaceState({}, document.title, newUrl.toString());
    }
  }, [location, showDebugInfo]);

  // Adapter functions to convert Promise<void> to Promise<boolean>
  const handleConnect = async (providerId: string): Promise<boolean> => {
    await connectProvider(providerId);
    return true;
  };

  const handleDisconnect = async (providerId: string): Promise<boolean> => {
    await disconnectProvider(providerId);
    return true;
  };

  const handleRefresh = async (providerId: string): Promise<boolean> => {
    await refreshProviderData(providerId);
    return true;
  };
  
  const handleCheckConnection = async () => {
    setIsCheckingConnection(true);
    try {
      await syncHealthData();
      const hasGoogleFitConnected = healthData?.vitalSigns?.heartRate?.source === 'Google Fit';
      
      toast.success("Connection check completed", {
        description: hasGoogleFitConnected 
          ? "Google Fit connection is working properly." 
          : "Google Fit is not connected. Please connect it to sync your health data."
      });
    } catch (error) {
      console.error("Error checking connection:", error);
      toast.error("Connection check failed", {
        description: "There was an error checking your Google Fit connection."
      });
    } finally {
      setIsCheckingConnection(false);
    }
  };
  
  // Determine if Google Fit is connected based on data source
  const hasGoogleFitConnected = healthData?.vitalSigns?.heartRate?.source === 'Google Fit';
  
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
          
          {/* Debug info component */}
          <OAuthDebugInfo 
            isVisible={showDebugInfo}
            supabaseUrl={import.meta.env.VITE_SUPABASE_URL}
            redirectUri={`${import.meta.env.VITE_SUPABASE_URL || "https://evqbnxbeimcacqkgdola.supabase.co"}/functions/v1/google-fit-callback`}
            onRefresh={handleCheckConnection}
            isLoading={isCheckingConnection}
          />
          
          {/* Connection instructions alert */}
          <Alert className="mb-6 border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertTitle className="text-blue-800 dark:text-blue-300">Connect with Google Fit</AlertTitle>
            <AlertDescription className="flex justify-between items-center flex-col md:flex-row gap-2">
              <span className="text-blue-700 dark:text-blue-400">
                Connect your Google Fit account to sync your health data. Your data is securely stored and will be
                visible only to you and your healthcare providers.
              </span>
              <div className="flex gap-2">
                <GoogleFitConnect 
                  variant="outline" 
                  className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700" 
                />
                {!showDebugInfo && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowDebugInfo(true)}
                    className="text-blue-700 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900"
                  >
                    Show Debug Info
                  </Button>
                )}
              </div>
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 gap-6">
            <ComprehensiveHealthDashboard 
              healthData={healthData}
              isLoading={isLoading}
              lastSynced={lastSynced}
              onSyncClick={syncHealthData}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
            <div className="lg:col-span-8">
              <FitnessIntegrations 
                providers={providers}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
                onRefresh={handleRefresh}
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
