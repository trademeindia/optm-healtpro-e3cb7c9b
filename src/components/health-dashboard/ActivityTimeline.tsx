import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useHealthData } from '@/hooks/useHealthData';
import { HealthMetric, HealthMetricType } from '@/services/health';
import { Activity, ChevronRight } from 'lucide-react';

interface ActivityTimelineProps {
  timeRange?: string;
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ timeRange = 'week' }) => {
  const { metricsHistory, isLoading } = useHealthData();
  
  // Combine relevant metric histories into a single activity array
  const activities: HealthMetric[] = React.useMemo(() => {
    const steps = metricsHistory.steps || [];
    const workouts = metricsHistory.workout || [];
    
    // Combine and sort by timestamp
    return [...steps, ...workouts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [metricsHistory]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Activity Timeline
        </CardTitle>
        <CardDescription>
          Recent activities and workouts
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <p>Loading activities...</p>
        ) : activities.length === 0 ? (
          <p>No recent activities found.</p>
        ) : (
          <ul className="list-none p-0 m-0">
            {activities.map((activity) => (
              <li key={activity.id} className="py-2 border-b last:border-b-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {activity.type === 'steps' ? 'Steps' : 'Workout'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                    {activity.type === 'steps' && (
                      <p className="text-sm">
                        {activity.value} steps
                      </p>
                    )}
                    {activity.type === 'workout' && (
                      <p className="text-sm">
                        {activity.value} {activity.unit}
                      </p>
                    )}
                  </div>
                  <Button size="sm" variant="outline">
                    View Details
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityTimeline;
