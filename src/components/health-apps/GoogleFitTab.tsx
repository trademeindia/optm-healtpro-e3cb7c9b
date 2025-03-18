
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GoogleFitInfo from './GoogleFitInfo';
import { Heart, Activity, Calendar, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useFitnessIntegration from '@/hooks/useFitnessIntegration';

interface GoogleFitTabProps {
  onHealthDataSync: (data: any) => void;
}

const GoogleFitTab: React.FC<GoogleFitTabProps> = ({ onHealthDataSync }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const { 
    fitnessData, 
    connectProvider,
    isLoading,
    error
  } = useFitnessIntegration();

  const handleSync = async () => {
    try {
      // Connect to Google Fit provider if it's defined
      const success = await connectProvider('google_fit');
      if (success) {
        onHealthDataSync(fitnessData);
      }
    } catch (err) {
      console.error('Error syncing health data:', err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8">
        <Card className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span>Overview</span>
                </TabsTrigger>
                <TabsTrigger value="activity" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  <span>Activity</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>History</span>
                </TabsTrigger>
              </TabsList>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleSync}
                disabled={isLoading}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isLoading ? 'Syncing...' : 'Sync Now'}</span>
              </Button>
            </div>

            <TabsContent value="overview">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Google Fit Overview</h3>
                <p className="text-muted-foreground">
                  Connect to Google Fit to sync your health and fitness data.
                </p>
                
                {error && (
                  <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
                    {error}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(fitnessData).map(([key, metric]) => (
                    <div key={key} className="border rounded-lg p-4">
                      <h4 className="font-medium">{metric.name}</h4>
                      <div className="flex items-end gap-2 mt-2">
                        <span className="text-2xl font-bold">{metric.value}</span>
                        <span className="text-muted-foreground">{metric.unit}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Last updated: {new Date(metric.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))}

                  {Object.keys(fitnessData).length === 0 && !isLoading && (
                    <div className="col-span-full text-center py-8 text-muted-foreground">
                      <p>No health data available. Click "Sync Now" to fetch your latest data.</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="activity">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Activity Data</h3>
                <p className="text-muted-foreground">
                  View your recent activity and exercise data.
                </p>
                
                {/* Placeholder for activity data */}
                <div className="border rounded-lg p-6 text-center">
                  <p className="text-muted-foreground">Activity data visualization coming soon.</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="history">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">History</h3>
                <p className="text-muted-foreground">
                  View your historical health and fitness data.
                </p>
                
                {/* Placeholder for historical data */}
                <div className="border rounded-lg p-6 text-center">
                  <p className="text-muted-foreground">Historical data visualization coming soon.</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      
      <div className="lg:col-span-4">
        <GoogleFitInfo />
      </div>
    </div>
  );
};

export default GoogleFitTab;
