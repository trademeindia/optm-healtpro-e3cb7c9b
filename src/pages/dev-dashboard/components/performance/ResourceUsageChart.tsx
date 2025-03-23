
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { Server } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatBytes } from '../../utils/formatters';

interface ResourceUsageChartProps {
  cpuUsage: Array<{ timestamp: string; value: number }>;
  memoryUsage: Array<{ timestamp: string; value: number }>;
  diskUsage: Array<{ timestamp: string; value: number }>;
}

const ResourceUsageChart: React.FC<ResourceUsageChartProps> = ({
  cpuUsage,
  memoryUsage,
  diskUsage
}) => {
  const chartConfig = {
    cpu: { color: '#f97316' },
    memory: { color: '#60a5fa' },
    disk: { color: '#8b5cf6' }
  };
  
  // Combine data for the chart
  const data = cpuUsage.map((item, index) => ({
    timestamp: item.timestamp,
    cpu: item.value,
    memory: memoryUsage[index]?.value || 0,
    disk: diskUsage[index]?.value || 0
  }));
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center">
          <Server className="h-5 w-5 mr-2 text-emerald-500" />
          Resource Usage Monitoring
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer config={chartConfig} className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
                  }}
                />
                <YAxis yAxisId="left" 
                  tickFormatter={(value) => `${value}%`}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  tickFormatter={(value) => formatBytes(value, 0)}
                />
                <Tooltip 
                  formatter={(value: any, name: string) => {
                    if (name === 'cpu') return [`${value}%`, 'CPU Usage'];
                    return [formatBytes(value), name === 'memory' ? 'Memory Usage' : 'Disk I/O'];
                  }}
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleString();
                  }}
                />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="cpu" 
                  stroke="#f97316" 
                  name="CPU"
                  activeDot={{ r: 8 }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="memory" 
                  stroke="#60a5fa" 
                  name="Memory"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="disk" 
                  stroke="#8b5cf6" 
                  name="Disk I/O"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceUsageChart;
