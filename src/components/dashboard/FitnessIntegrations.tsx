
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Link as LinkIcon, 
  Link2Off 
} from 'lucide-react';

export interface FitnessProvider {
  id: string;
  name: string;
  logo: string;
  isConnected: boolean;
  lastSync?: string;
  metrics: string[];
}

interface FitnessIntegrationsProps {
  providers: FitnessProvider[];
  onConnect: (providerId: string) => Promise<boolean>;
  onDisconnect: (providerId: string) => Promise<boolean>;
  onRefresh: (providerId: string) => Promise<boolean>;
  className?: string;
}

const FitnessIntegrations: React.FC<FitnessIntegrationsProps> = ({
  providers,
  onConnect,
  onDisconnect,
  onRefresh,
  className,
}) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<FitnessProvider | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const connectedProviders = providers.filter(p => p.isConnected);
  const availableProviders = providers.filter(p => !p.isConnected);

  const handleConnect = async (provider: FitnessProvider) => {
    setSelectedProvider(provider);
    setIsOpen(true);
  };

  const handleConfirmConnect = async () => {
    if (!selectedProvider) return;
    
    setIsLoading(true);
    try {
      const success = await onConnect(selectedProvider.id);
      if (success) {
        toast({
          title: "Successfully connected",
          description: `Your ${selectedProvider.name} account has been connected and data is being synced.`,
        });
        setIsOpen(false);
      }
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "There was an error connecting to the service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async (provider: FitnessProvider) => {
    setIsLoading(true);
    try {
      const success = await onDisconnect(provider.id);
      if (success) {
        toast({
          title: "Disconnected",
          description: `Your ${provider.name} account has been disconnected.`,
        });
      }
    } catch (error) {
      toast({
        title: "Disconnection failed",
        description: "There was an error disconnecting the service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async (provider: FitnessProvider) => {
    setIsLoading(true);
    try {
      const success = await onRefresh(provider.id);
      if (success) {
        toast({
          title: "Data refreshed",
          description: `Your ${provider.name} data has been refreshed.`,
        });
      }
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "There was an error refreshing your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("glass-morphism rounded-2xl p-6", className)}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Connected Health Apps</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="gap-1.5"
        >
          <LinkIcon className="h-4 w-4" />
          <span>Connect App</span>
        </Button>
      </div>

      <Tabs defaultValue="connected" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="connected">
            Connected ({connectedProviders.length})
          </TabsTrigger>
          <TabsTrigger value="available">
            Available ({availableProviders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="connected" className="space-y-4">
          {connectedProviders.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <p>No fitness apps connected yet.</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => setIsOpen(true)}
              >
                Connect App
              </Button>
            </div>
          ) : (
            connectedProviders.map((provider) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 rounded-lg border bg-card"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                    <img
                      src={provider.logo}
                      alt={provider.name}
                      className="w-6 h-6 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/24';
                      }}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{provider.name}</h4>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Connected
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Last synced: {provider.lastSync || 'Never'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full"
                    onClick={() => handleRefresh(provider)}
                    disabled={isLoading}
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span className="sr-only">Refresh</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    onClick={() => handleDisconnect(provider)}
                    disabled={isLoading}
                  >
                    <Link2Off className="h-4 w-4" />
                    <span className="sr-only">Disconnect</span>
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          {availableProviders.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <p>All available fitness apps are already connected.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {availableProviders.map((provider) => (
                <Card key={provider.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                          <img
                            src={provider.logo}
                            alt={provider.name}
                            className="w-6 h-6 object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://via.placeholder.com/24';
                            }}
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">{provider.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {provider.metrics.join(', ')}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button
                      className="w-full mt-4"
                      size="sm"
                      onClick={() => handleConnect(provider)}
                    >
                      Connect
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Health App</DialogTitle>
            <DialogDescription>
              Connect your fitness app to automatically sync your health data.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className={cn(
                  "flex flex-col items-center p-4 rounded-lg border border-input cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors",
                  selectedProvider?.id === provider.id && "border-primary bg-primary/5"
                )}
                onClick={() => setSelectedProvider(provider)}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 overflow-hidden">
                  <img
                    src={provider.logo}
                    alt={provider.name}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/32';
                    }}
                  />
                </div>
                <span className="text-sm font-medium">{provider.name}</span>
                <span className="text-xs text-muted-foreground mt-1">
                  {provider.isConnected ? 'Connected' : 'Available'}
                </span>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmConnect} 
              disabled={!selectedProvider || isLoading}
            >
              {isLoading ? 'Connecting...' : 'Connect'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FitnessIntegrations;
