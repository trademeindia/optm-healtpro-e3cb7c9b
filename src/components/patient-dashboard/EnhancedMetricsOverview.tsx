
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HealthMetric } from '@/types/health';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';
import { Activity, Heart, Thermometer, Droplet } from 'lucide-react';

// Create mock data for the charts
const generateMockData = (baseValue: number, count: number = 7) => {
  return Array.from({ length: count }, (_, i) => ({
    name: `Day ${i + 1}`,
    value: baseValue + Math.random() * 10 - 5
  }));
};

interface EnhancedMetricsOverviewProps {
  metrics: HealthMetric[];
}

const EnhancedMetricsOverview: React.FC<EnhancedMetricsOverviewProps> = ({ metrics }) => {
  // Default metrics if none provided
  const defaultMetrics: HealthMetric[] = [
    {
      id: '1',
      name: 'Heart Rate',
      value: 72,
      unit: 'bpm',
      change: 2,
      status: 'normal',
      trend: 'stable',
      source: 'Google Fit',
      lastSync: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Blood Pressure',
      value: '120/80',
      unit: 'mmHg',
      status: 'normal',
      trend: 'stable'
    },
    {
      id: '3',
      name: 'Temperature',
      value: 98.6,
      unit: '°F',
      status: 'normal',
      trend: 'stable'
    },
    {
      id: '4',
      name: 'Oxygen Saturation',
      value: 98,
      unit: '%',
      status: 'normal',
      trend: 'stable'
    }
  ];

  const metricsToDisplay = metrics && metrics.length > 0 ? metrics : defaultMetrics;
  
  const getIconForMetric = (name: string) => {
    switch (name.toLowerCase()) {
      case 'heart rate':
        return <Heart className="h-4 w-4 text-rose-500" />;
      case 'blood pressure':
        return <Activity className="h-4 w-4 text-indigo-500" />;
      case 'temperature':
        return <Thermometer className="h-4 w-4 text-amber-500" />;
      case 'oxygen saturation':
        return <Droplet className="h-4 w-4 text-sky-500" />;
      default:
        return <Activity className="h-4 w-4 text-primary" />;
    }
  };

  const getColorForMetric = (name: string) => {
    switch (name.toLowerCase()) {
      case 'heart rate':
        return '#f43f5e';
      case 'blood pressure':
        return '#6366f1';
      case 'temperature':
        return '#f59e0b';
      case 'oxygen saturation':
        return '#0ea5e9';
      default:
        return '#8b5cf6';
    }
  };

  return (
    <Card className="shadow-md border-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Health Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metricsToDisplay.map((metric, index) => {
            const mockData = generateMockData(
              typeof metric.value === 'number' ? metric.value : 100, 
              7
            );
            
            return (
              <div key={metric.id} className="flex flex-col space-y-3 rounded-lg border p-4 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="mr-3 p-2 rounded-full bg-primary/10">
                      {getIconForMetric(metric.name)}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{metric.name}</h4>
                      <div className="flex items-baseline">
                        <span className="text-lg font-bold">{metric.value}</span>
                        <span className="ml-1 text-xs text-muted-foreground">{metric.unit}</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    {metric.status}
                  </div>
                </div>
                
                <div className="h-20 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    {index % 2 === 0 ? (
                      <LineChart data={mockData}>
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke={getColorForMetric(metric.name)} 
                          strokeWidth={2} 
                          dot={false}
                        />
                        <Tooltip 
                          labelFormatter={() => metric.name}
                          formatter={(value) => [`${value} ${metric.unit}`, '']}
                          contentStyle={{ 
                            background: 'rgba(255, 255, 255, 0.8)', 
                            border: 'none', 
                            borderRadius: '4px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
                          }}
                        />
                      </LineChart>
                    ) : (
                      <AreaChart data={mockData}>
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          fill={`${getColorForMetric(metric.name)}30`} 
                          stroke={getColorForMetric(metric.name)} 
                          strokeWidth={2} 
                        />
                        <Tooltip 
                          labelFormatter={() => metric.name}
                          formatter={(value) => [`${value} ${metric.unit}`, '']}
                          contentStyle={{ 
                            background: 'rgba(255, 255, 255, 0.8)', 
                            border: 'none',
                            borderRadius: '4px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
                          }}
                        />
                      </AreaChart>
                    )}
                  </ResponsiveContainer>
                </div>
                
                {metric.source && (
                  <div className="text-xs text-muted-foreground flex justify-between">
                    <span>{metric.source}</span>
                    <span>Last updated: {new Date(metric.lastSync || Date.now()).toLocaleTimeString()}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedMetricsOverview;
