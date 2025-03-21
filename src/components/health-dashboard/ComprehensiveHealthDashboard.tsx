import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { HealthMetric } from '@/types/health';
import { TimeRange } from '@/services/health';
import { Activity, Heart, Footprints, Flame, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import DetailedMetricsTabs from './dashboard/DetailedMetricsTabs';

interface ComprehensiveHealthDashboardProps {
  healthData: any;
  isLoading: boolean;
  lastSynced?: string;
  onSyncClick: () => void;
}

const ComprehensiveHealthDashboard: React.FC<ComprehensiveHealthDashboardProps> = ({
  healthData,
  isLoading,
  lastSynced,
  onSyncClick
}) => {
  const [activeTab, setActiveTab] = React.useState('overview');
  const [timeRange, setTimeRange] = React.useState<TimeRange>('week');
  
  const metricsHistory = {
    steps: Array.from({ length: 7 }).map((_, i) => ({ 
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000), 
      value: Math.floor(Math.random() * 5000) + 3000 
    })),
    calories: Array.from({ length: 7 }).map((_, i) => ({ 
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000), 
      value: Math.floor(Math.random() * 800) + 1200 
    })),
    distance: Array.from({ length: 7 }).map((_, i) => ({ 
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000), 
      value: Math.random() * 5 + 2 
    })),
    heart_rate: Array.from({ length: 24 }).map((_, i) => ({ 
      time: new Date(Date.now() - (23 - i) * 60 * 60 * 1000), 
      value: Math.floor(Math.random() * 20) + 60 
    })),
    sleep: Array.from({ length: 7 }).map((_, i) => ({ 
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000), 
      deepSleep: Math.random() * 2 + 1, 
      lightSleep: Math.random() * 4 + 3, 
      remSleep: Math.random() * 1.5 + 0.5, 
      awake: Math.random() * 0.5 
    })),
    workout: Array.from({ length: 5 }).map((_, i) => ({
      date: new Date(Date.now() - (10 - i * 2) * 24 * 60 * 60 * 1000),
      type: ['Running', 'Cycling', 'Swimming', 'Weightlifting', 'Yoga'][i],
      duration: Math.floor(Math.random() * 60) + 20,
      calories: Math.floor(Math.random() * 400) + 100,
      distance: i < 3 ? Math.random() * 8 + 2 : undefined
    }))
  };
  
  const formatLastSynced = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return format(date, 'PPp');
  };
  
  return (
    <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab} value={activeTab}>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <CardTitle>Health Dashboard</CardTitle>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm">
              <span className="text-muted-foreground">
                Last synced: {formatLastSynced(lastSynced)}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onSyncClick}
                disabled={isLoading}
                className="h-8"
              >
                {isLoading ? 'Syncing...' : 'Sync Now'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Footprints className="h-4 w-4" />
              <span className="hidden sm:inline">Activity</span>
            </TabsTrigger>
            <TabsTrigger value="heart" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Heart</span>
            </TabsTrigger>
            <TabsTrigger value="calories" className="flex items-center gap-2">
              <Flame className="h-4 w-4" />
              <span className="hidden sm:inline">Calories</span>
            </TabsTrigger>
            <TabsTrigger value="sleep" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Sleep</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <MetricCard 
                title="Steps"
                value={healthData?.activity?.steps?.value || 0}
                unit="steps"
                target={10000}
                icon={<Footprints className="h-5 w-5 text-primary" />}
                trend={healthData?.activity?.steps?.trend}
                change={healthData?.activity?.steps?.change}
              />
              <MetricCard 
                title="Heart Rate"
                value={healthData?.vitalSigns?.heartRate?.value || 0}
                unit="bpm"
                icon={<Heart className="h-5 w-5 text-primary" />}
                status={healthData?.vitalSigns?.heartRate?.status}
              />
              <MetricCard 
                title="Calories"
                value={healthData?.activity?.calories?.value || 0}
                unit="kcal"
                target={2000}
                icon={<Flame className="h-5 w-5 text-primary" />}
                trend={healthData?.activity?.calories?.trend}
              />
              <MetricCard 
                title="Distance"
                value={healthData?.activity?.distance?.value || 0}
                unit="km"
                target={5}
                icon={<Activity className="h-5 w-5 text-primary" />}
                trend={healthData?.activity?.distance?.trend}
              />
              <MetricCard 
                title="Sleep"
                value={healthData?.sleep?.duration?.value || 0}
                unit="hrs"
                target={8}
                icon={<Clock className="h-5 w-5 text-primary" />}
                status={healthData?.sleep?.duration?.status}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="activity">
            <div className="text-center py-12 border rounded-lg">
              <Footprints className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">Activity Tracking</h3>
              <p className="text-muted-foreground max-w-md mx-auto mt-2">
                Detailed activity tracking information will be displayed here.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="heart">
            <div className="text-center py-12 border rounded-lg">
              <Heart className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">Heart Rate Monitoring</h3>
              <p className="text-muted-foreground max-w-md mx-auto mt-2">
                Detailed heart rate information will be displayed here.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="calories">
            <div className="text-center py-12 border rounded-lg">
              <Flame className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">Calorie Tracking</h3>
              <p className="text-muted-foreground max-w-md mx-auto mt-2">
                Detailed calorie tracking information will be displayed here.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="sleep">
            <div className="text-center py-12 border rounded-lg">
              <Clock className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">Sleep Analysis</h3>
              <p className="text-muted-foreground max-w-md mx-auto mt-2">
                Detailed sleep analysis information will be displayed here.
              </p>
            </div>
          </TabsContent>
        </CardContent>
      </Card>
      
      <DetailedMetricsTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedTimeRange={timeRange}
        metricsHistory={metricsHistory}
        isLoading={isLoading}
      />
    </Tabs>
  );
};

interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  target?: number;
  trend?: 'up' | 'down' | 'stable';
  change?: number;
  status?: 'normal' | 'warning' | 'critical' | 'elevated' | 'low';
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  icon,
  target,
  trend,
  change,
  status
}) => {
  const percentage = target ? Math.min(Math.round((value / target) * 100), 100) : null;
  
  const getStatusColor = () => {
    if (status) {
      if (status === 'normal') return 'text-green-500';
      if (status === 'warning') return 'text-amber-500';
      if (status === 'critical') return 'text-red-500';
      if (status === 'elevated') return 'text-amber-500';
      if (status === 'low') return 'text-blue-500';
    }
    return '';
  };
  
  const getTrendIcon = () => {
    if (trend === 'up') return <span className="text-green-500">↑</span>;
    if (trend === 'down') return <span className="text-red-500">↓</span>;
    if (trend === 'stable') return <span className="text-gray-500">→</span>;
    return null;
  };
  
  return (
    <div className="bg-card border rounded-xl p-4 flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm font-medium">{title}</span>
        <div className="bg-primary/10 p-1.5 rounded-full">{icon}</div>
      </div>
      
      <div className="mt-auto">
        <div className="flex items-baseline">
          <span className={`text-2xl font-bold ${getStatusColor()}`}>{value}</span>
          <span className="text-xs ml-1 text-muted-foreground">{unit}</span>
        </div>
        
        {(target || trend) && (
          <div className="text-xs text-muted-foreground flex items-center mt-1">
            {target && (
              <div className="flex-1">
                <div className="h-1.5 bg-muted rounded-full w-full mt-1 mb-1">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span>{percentage}% of target</span>
              </div>
            )}
            
            {trend && (
              <div className="flex items-center ml-auto">
                {getTrendIcon()}
                {change && <span className="ml-1">{Math.abs(change)}%</span>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComprehensiveHealthDashboard;
