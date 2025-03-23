
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BuildTime } from '../../types';

interface BuildTimeChartProps {
  buildTimes: BuildTime[];
}

const BuildTimeChart: React.FC<BuildTimeChartProps> = ({ buildTimes }) => {
  const chartConfig = {
    buildTime: { color: '#8b5cf6' }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center">
          <Clock className="h-5 w-5 mr-2 text-purple-500" />
          Build Time History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer config={chartConfig} className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={buildTimes}
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
                <YAxis 
                  tickFormatter={(value) => `${value}s`}
                />
                <Tooltip 
                  formatter={(value: any) => [`${value}s`, 'Build Time']}
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleString();
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="duration" 
                  stroke="#8b5cf6" 
                  fill="url(#colorBuildTime)" 
                />
                <defs>
                  <linearGradient id="colorBuildTime" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default BuildTimeChart;
