
import React, { useState } from 'react';
import { useGoogleFitIntegration } from '@/hooks/useGoogleFitIntegration';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { 
  Heart, 
  ActivitySquare, 
  Link2, 
  Link2Off, 
  RefreshCw,
  Circle,
  Flame,
  ScanEye,
  Moon,
  Clock
} from 'lucide-react';
import HealthMetric from '@/components/dashboard/HealthMetric';
import { FitnessData } from '@/hooks/useFitnessIntegration';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface GoogleFitSyncPanelProps {
  onHealthDataSync?: (data: FitnessData) => void;
  className?: string;
}

const GoogleFitSyncPanel: React.FC<GoogleFitSyncPanelProps> = ({ 
  onHealthDataSync,
  className = ''
}) => {
  const {
    isConnected,
    isLoading,
    connectGoogleFit,
    disconnectGoogleFit,
    syncGoogleFitData,
    lastSyncTime,
    healthData,
    getHistoricalData
  } = useGoogleFitIntegration();

  const [activeTab, setActiveTab] = useState('current');
  const [historyPeriod, setHistoryPeriod] = useState('7days');
  const [historyDataType, setHistoryDataType] = useState('steps');
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const handleConnect = () => {
    if (!isConnected) {
      connectGoogleFit();
    }
  };

  const handleDisconnect = async () => {
    if (isConnected) {
      await disconnectGoogleFit();
    }
  };

  const handleSync = async () => {
    if (isConnected) {
      const syncedData = await syncGoogleFitData();
      if (onHealthDataSync) {
        onHealthDataSync(syncedData);
      }
    }
  };

  const fetchHistoricalData = async () => {
    if (!isConnected) return;
    
    setIsLoadingHistory(true);
    
    try {
      const endDate = new Date();
      const startDate = new Date();
      
      // Set start date based on selected period
      if (historyPeriod === '7days') {
        startDate.setDate(endDate.getDate() - 7);
      } else if (historyPeriod === '30days') {
        startDate.setDate(endDate.getDate() - 30);
      } else if (historyPeriod === '90days') {
        startDate.setDate(endDate.getDate() - 90);
      }
      
      const data = await getHistoricalData({
        dataType: historyDataType,
        startDate,
        endDate
      });
      
      // Format data for the chart
      const formattedData = data.map(point => ({
        date: format(new Date(point.startTime), 'MMM dd'),
        value: point.value
      }));
      
      setHistoryData(formattedData);
    } catch (error) {
      console.error("Error fetching historical data:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Fetch historical data when tab, period or data type changes
  React.useEffect(() => {
    if (activeTab === 'history') {
      fetchHistoricalData();
    }
  }, [activeTab, historyPeriod, historyDataType]);

  const getMetricIcon = (metricName: string) => {
    switch (metricName.toLowerCase()) {
      case 'heart rate':
        return <Heart className="w-4 h-4 md:w-5 md:h-5" />;
      case 'steps':
        return <ActivitySquare className="w-4 h-4 md:w-5 md:h-5" />;
      case 'calories':
        return <Flame className="w-4 h-4 md:w-5 md:h-5" />;
      case 'distance':
        return <Circle className="w-4 h-4 md:w-5 md:h-5" />;
      case 'sleep':
        return <Moon className="w-4 h-4 md:w-5 md:h-5" />;
      case 'active minutes':
        return <Clock className="w-4 h-4 md:w-5 md:h-5" />;
      default:
        return <ScanEye className="w-4 h-4 md:w-5 md:h-5" />;
    }
  };

  // Render different content based on connection status
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4 py-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      );
    }
    
    if (!isConnected) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-primary/10 p-3 mb-4">
            <Link2 className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">Connect to Google Fit</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-md">
            Sync your health and fitness data from Google Fit to track your progress and gain insights about your health.
          </p>
          <Button onClick={handleConnect} className="gap-2">
            <Link2 className="h-4 w-4" />
            <span>Connect Google Fit</span>
          </Button>
        </div>
      );
    }
    
    return (
      <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="current">Current Data</TabsTrigger>
            <TabsTrigger value="history">Historical Data</TabsTrigger>
          </TabsList>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleSync}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync Now</span>
          </Button>
        </div>
        
        <TabsContent value="current" className="space-y-4 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {healthData.steps && (
              <HealthMetric
                title="Steps"
                value={healthData.steps.value}
                unit={healthData.steps.unit}
                change={healthData.steps.change}
                icon={getMetricIcon('steps')}
                color="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                source="Google Fit"
                lastSync={lastSyncTime ? format(new Date(lastSyncTime), 'h:mm a') : undefined}
                isConnected={true}
              />
            )}
            
            {healthData.heartRate && (
              <HealthMetric
                title="Heart Rate"
                value={healthData.heartRate.value}
                unit={healthData.heartRate.unit}
                change={healthData.heartRate.change}
                icon={getMetricIcon('heart rate')}
                color="bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400"
                source="Google Fit"
                lastSync={lastSyncTime ? format(new Date(lastSyncTime), 'h:mm a') : undefined}
                isConnected={true}
              />
            )}
            
            {healthData.calories && (
              <HealthMetric
                title="Calories"
                value={healthData.calories.value}
                unit={healthData.calories.unit}
                change={healthData.calories.change}
                icon={getMetricIcon('calories')}
                color="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                source="Google Fit"
                lastSync={lastSyncTime ? format(new Date(lastSyncTime), 'h:mm a') : undefined}
                isConnected={true}
              />
            )}
            
            {healthData.distance && (
              <HealthMetric
                title="Distance"
                value={healthData.distance.value}
                unit={healthData.distance.unit}
                change={healthData.distance.change}
                icon={getMetricIcon('distance')}
                color="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
                source="Google Fit"
                lastSync={lastSyncTime ? format(new Date(lastSyncTime), 'h:mm a') : undefined}
                isConnected={true}
              />
            )}
            
            {healthData.sleep && (
              <HealthMetric
                title="Sleep"
                value={healthData.sleep.value}
                unit={healthData.sleep.unit}
                change={healthData.sleep.change}
                icon={getMetricIcon('sleep')}
                color="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                source="Google Fit"
                lastSync={lastSyncTime ? format(new Date(lastSyncTime), 'h:mm a') : undefined}
                isConnected={true}
              />
            )}
            
            {healthData.activeMinutes && (
              <HealthMetric
                title="Active Minutes"
                value={healthData.activeMinutes.value}
                unit={healthData.activeMinutes.unit}
                change={healthData.activeMinutes.change}
                icon={getMetricIcon('active minutes')}
                color="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                source="Google Fit"
                lastSync={lastSyncTime ? format(new Date(lastSyncTime), 'h:mm a') : undefined}
                isConnected={true}
              />
            )}
          </div>
          
          {Object.keys(healthData).length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No health data available. Click "Sync Now" to fetch your latest data.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4 mt-2">
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="flex items-center mr-4">
              <label className="text-sm mr-2">Metric:</label>
              <select 
                className="text-sm border rounded p-1"
                value={historyDataType}
                onChange={(e) => setHistoryDataType(e.target.value)}
              >
                <option value="steps">Steps</option>
                <option value="heart_rate">Heart Rate</option>
                <option value="calories">Calories</option>
                <option value="distance">Distance</option>
                <option value="sleep">Sleep</option>
                <option value="active_minutes">Active Minutes</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <label className="text-sm mr-2">Period:</label>
              <select 
                className="text-sm border rounded p-1"
                value={historyPeriod}
                onChange={(e) => setHistoryPeriod(e.target.value)}
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
              </select>
            </div>
          </div>
          
          {isLoadingHistory ? (
            <Skeleton className="h-[300px] w-full" />
          ) : historyData.length > 0 ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" name={historyDataType.replace('_', ' ')} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No historical data available for the selected period.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    );
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Google Fit Integration</CardTitle>
            <CardDescription>
              Sync your health and fitness data
            </CardDescription>
          </div>
          {isConnected && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleDisconnect}
              className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
            >
              <Link2Off className="h-4 w-4 mr-2" />
              Disconnect
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
      {isConnected && lastSyncTime && (
        <CardFooter className="text-xs text-muted-foreground border-t pt-4">
          Last synchronized: {format(new Date(lastSyncTime), 'MMMM d, yyyy h:mm a')}
        </CardFooter>
      )}
    </Card>
  );
};

export default GoogleFitSyncPanel;
