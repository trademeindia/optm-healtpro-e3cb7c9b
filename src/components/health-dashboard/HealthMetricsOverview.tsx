
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { HealthMetric } from '@/services/healthDataService';
import { Heart, ActivitySquare, Flame, Route, Moon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface HealthMetricsOverviewProps {
  metrics: Record<string, HealthMetric | null>;
  isLoading: boolean;
  className?: string;
}

const MetricCard: React.FC<{ 
  title: string;
  value: string | number;
  unit: string;
  icon: React.ReactNode;
  change?: number;
  isLoading: boolean;
}> = ({ title, value, unit, icon, change, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-3xl font-bold">
              {value || '0'}
              <span className="text-sm font-normal ml-1">{unit}</span>
            </h3>
            {typeof change !== 'undefined' && (
              <p className={`text-xs ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% from previous period
              </p>
            )}
          </div>
          <div className="p-2 rounded-full bg-primary/10">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const HealthMetricsOverview: React.FC<HealthMetricsOverviewProps> = ({ 
  metrics, 
  isLoading,
  className 
}) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      <MetricCard
        title="Heart Rate"
        value={metrics.heart_rate?.value || 0}
        unit="bpm"
        icon={<Heart className="h-6 w-6 text-red-500" />}
        change={metrics.heart_rate?.metadata?.change as number}
        isLoading={isLoading}
      />
      <MetricCard
        title="Daily Steps"
        value={metrics.steps?.value || 0}
        unit="steps"
        icon={<ActivitySquare className="h-6 w-6 text-blue-500" />}
        change={metrics.steps?.metadata?.change as number}
        isLoading={isLoading}
      />
      <MetricCard
        title="Calories Burned"
        value={metrics.calories?.value || 0}
        unit="kcal"
        icon={<Flame className="h-6 w-6 text-orange-500" />}
        change={metrics.calories?.metadata?.change as number}
        isLoading={isLoading}
      />
      <MetricCard
        title="Distance"
        value={metrics.distance?.value || 0}
        unit="km"
        icon={<Route className="h-6 w-6 text-green-500" />}
        change={metrics.distance?.metadata?.change as number}
        isLoading={isLoading}
      />
    </div>
  );
};

export default HealthMetricsOverview;
