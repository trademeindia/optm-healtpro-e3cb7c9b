
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, AlertCircle, ArrowDown, ArrowUp, Minus } from 'lucide-react';

interface Symptom {
  id: string;
  name: string;
  intensity: number;
  trend: 'improving' | 'worsening' | 'stable';
  date: string;
}

const RecentSymptoms: React.FC = () => {
  // Mock data for symptoms (in production this would come from props or context)
  const symptoms: Symptom[] = [
    {
      id: '1',
      name: 'Back pain',
      intensity: 3,
      trend: 'improving',
      date: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: '2',
      name: 'Headache',
      intensity: 2,
      trend: 'stable',
      date: new Date(Date.now() - 86400000 * 4).toISOString()
    },
    {
      id: '3',
      name: 'Joint stiffness',
      intensity: 4,
      trend: 'worsening',
      date: new Date(Date.now() - 86400000 * 1).toISOString()
    }
  ];

  // Get trend icon based on symptom trend
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <ArrowDown className="h-4 w-4 text-green-500" />;
      case 'worsening':
        return <ArrowUp className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  // Get intensity style based on level (1-5)
  const getIntensityStyle = (intensity: number) => {
    const colors = [
      'bg-green-200 dark:bg-green-900',
      'bg-lime-200 dark:bg-lime-900',
      'bg-yellow-200 dark:bg-yellow-900',
      'bg-orange-200 dark:bg-orange-900',
      'bg-red-200 dark:bg-red-900'
    ];
    return colors[Math.min(intensity - 1, 4)];
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Recent Symptoms</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {symptoms.length > 0 ? (
          symptoms.map((symptom) => (
            <div key={symptom.id} className="flex items-start space-x-3 rounded-md border p-3">
              <div className="mt-0.5">
                <Activity className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{symptom.name}</p>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(symptom.trend)}
                    <span className="text-xs">
                      {symptom.trend.charAt(0).toUpperCase() + symptom.trend.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex h-2 w-24">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div 
                        key={level}
                        className={`h-2 w-1/5 first:rounded-l-full last:rounded-r-full ${
                          level <= symptom.intensity 
                            ? getIntensityStyle(level)
                            : 'bg-gray-100 dark:bg-gray-800'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Level {symptom.intensity}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(symptom.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center py-6 text-center">
            <div className="space-y-2">
              <AlertCircle className="mx-auto h-6 w-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No symptoms recorded</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentSymptoms;
