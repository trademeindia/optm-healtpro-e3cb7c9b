
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Calendar } from 'lucide-react';
import { useHealthData } from '@/hooks/health';
import { TimeRange } from '@/services/health';
import HealthMetricsOverview from './HealthMetricsOverview';
import HeartRateMonitor from './HeartRateMonitor';
import WorkoutSummary from './WorkoutSummary';
import SleepAnalysis from './SleepAnalysis';
import ActivityTimeline from './ActivityTimeline';
import HealthSync from './HealthSync';
import GoogleFitConnect from '@/components/integrations/GoogleFitConnect';

interface HealthDashboardProps {
  className?: string;
}

const HealthDashboard: React.FC<HealthDashboardProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('week');
  
  const { 
    metrics, 
    metricsHistory,
    isLoading, 
    isSyncing, 
    lastSyncTime,
    hasGoogleFitConnected,
    connections,
    syncData,
    setTimeRange
  } = useHealthData({
    autoSync: true,
    syncInterval: 30000, // 30 seconds
    defaultTimeRange: selectedTimeRange
  });
  
  const handleTimeRangeChange = (range: TimeRange) => {
    setSelectedTimeRange(range);
    setTimeRange(range);
  };
  
  const handleSyncClick = async () => {
    await syncData(true);
  };
  
  return (
    <div className={className}>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Health Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Track and monitor your health metrics from Google Fit
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {hasGoogleFitConnected ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSyncClick}
              disabled={isSyncing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </Button>
          ) : (
            <GoogleFitConnect size="sm" />
          )}
        </div>
      </div>
      
      {/* Time Range Selector */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Time Range:</span>
        </div>
        <div className="flex space-x-1">
          <Button 
            variant={selectedTimeRange === 'day' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handleTimeRangeChange('day')}
          >
            Day
          </Button>
          <Button 
            variant={selectedTimeRange === 'week' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handleTimeRangeChange('week')}
          >
            Week
          </Button>
          <Button 
            variant={selectedTimeRange === 'month' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handleTimeRangeChange('month')}
          >
            Month
          </Button>
          <Button 
            variant={selectedTimeRange === 'year' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handleTimeRangeChange('year')}
          >
            Year
          </Button>
        </div>
      </div>
      
      {!hasGoogleFitConnected ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Connect Your Health Data</CardTitle>
            <CardDescription>
              Connect your Google Fit account to view your health metrics and activity data.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="text-center mb-6">
              <p className="text-muted-foreground mb-4">
                Get insights from your fitness tracking devices and apps by connecting your Google Fit account.
                Your data is securely stored and will be visible only to you and your healthcare providers.
              </p>
              <GoogleFitConnect 
                variant="default" 
                size="default"
                className="mx-auto"
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Health Metrics Overview */}
          <HealthMetricsOverview 
            metrics={metrics}
            isLoading={isLoading}
            className="mb-6"
          />
          
          {/* Detailed Metrics Tabs */}
          <Card className="mb-6">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <CardHeader className="pb-0">
                <TabsList className="grid grid-cols-5">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="heart">Heart Rate</TabsTrigger>
                  <TabsTrigger value="sleep">Sleep</TabsTrigger>
                  <TabsTrigger value="workouts">Workouts</TabsTrigger>
                </TabsList>
              </CardHeader>
              
              <CardContent className="pt-6">
                <TabsContent value="overview" className="m-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ActivityTimeline 
                      stepsData={metricsHistory.steps}
                      caloriesData={metricsHistory.calories}
                      distanceData={metricsHistory.distance}
                      timeRange={selectedTimeRange}
                      isLoading={isLoading}
                    />
                    <HeartRateMonitor 
                      heartRateData={metricsHistory.heart_rate}
                      isLoading={isLoading}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="activity" className="m-0">
                  <ActivityTimeline 
                    stepsData={metricsHistory.steps}
                    caloriesData={metricsHistory.calories}
                    distanceData={metricsHistory.distance}
                    timeRange={selectedTimeRange}
                    isLoading={isLoading}
                    showDetails={true}
                  />
                </TabsContent>
                
                <TabsContent value="heart" className="m-0">
                  <HeartRateMonitor 
                    heartRateData={metricsHistory.heart_rate}
                    isLoading={isLoading}
                    showDetails={true}
                  />
                </TabsContent>
                
                <TabsContent value="sleep" className="m-0">
                  <SleepAnalysis 
                    sleepData={metricsHistory.sleep}
                    timeRange={selectedTimeRange}
                    isLoading={isLoading}
                  />
                </TabsContent>
                
                <TabsContent value="workouts" className="m-0">
                  <WorkoutSummary 
                    workoutData={metricsHistory.workout}
                    timeRange={selectedTimeRange}
                    isLoading={isLoading}
                  />
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
          
          {/* Sync Information */}
          <HealthSync 
            connections={connections}
            lastSyncTime={lastSyncTime}
            onManualSync={handleSyncClick}
            isSyncing={isSyncing}
          />
        </>
      )}
    </div>
  );
};

export default HealthDashboard;
