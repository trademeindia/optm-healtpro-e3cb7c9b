
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { TimeRange } from '@/services/health';
import { Heart, Footprints, Flame, Clock } from 'lucide-react';
import DetailedMetricsTabs from './dashboard/DetailedMetricsTabs';

// Import refactored components
import MetricCard from './metrics/MetricCard';
import DashboardOverview from './overview/DashboardOverview';
import DashboardTabContent from './tabs/DashboardTabContent';
import TabsNavigation from './tabs/TabsNavigation';
import DashboardHeader from './DashboardHeader';

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
  
  return (
    <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab} value={activeTab}>
      <Card>
        <CardHeader className="pb-2">
          <DashboardHeader
            lastSynced={lastSynced}
            isLoading={isLoading}
            onSyncClick={onSyncClick}
          />
        </CardHeader>
        <CardContent>
          <TabsNavigation activeTab={activeTab} />

          <TabsContent value="overview">
            <DashboardOverview healthData={healthData} />
          </TabsContent>
          
          <TabsContent value="activity">
            <DashboardTabContent 
              icon={<Footprints className="h-10 w-10" />} 
              title="Activity Tracking" 
            />
          </TabsContent>
          
          <TabsContent value="heart">
            <DashboardTabContent 
              icon={<Heart className="h-10 w-10" />} 
              title="Heart Rate Monitoring" 
            />
          </TabsContent>
          
          <TabsContent value="calories">
            <DashboardTabContent 
              icon={<Flame className="h-10 w-10" />} 
              title="Calorie Tracking" 
            />
          </TabsContent>
          
          <TabsContent value="sleep">
            <DashboardTabContent 
              icon={<Clock className="h-10 w-10" />} 
              title="Sleep Analysis" 
            />
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

export default ComprehensiveHealthDashboard;
