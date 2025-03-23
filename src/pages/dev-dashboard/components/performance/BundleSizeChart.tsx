
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { Package } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BundleSize } from '../../types';
import { formatBytes } from '../../utils/formatters';

interface BundleSizeChartProps {
  bundleSizes: BundleSize[];
}

const BundleSizeChart: React.FC<BundleSizeChartProps> = ({ bundleSizes }) => {
  const chartConfig = {
    js: { color: '#60a5fa' },
    css: { color: '#34d399' },
    assets: { color: '#f97316' }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center">
          <Package className="h-5 w-5 mr-2 text-blue-500" />
          Bundle Size Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer config={chartConfig} className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={bundleSizes}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                />
                <YAxis 
                  tickFormatter={(value) => formatBytes(value, 0)}
                />
                <Tooltip 
                  formatter={(value: any) => [formatBytes(value), '']}
                />
                <Bar dataKey="js" stackId="a" fill="#60a5fa" name="JavaScript" />
                <Bar dataKey="css" stackId="a" fill="#34d399" name="CSS" />
                <Bar dataKey="assets" stackId="a" fill="#f97316" name="Assets" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default BundleSizeChart;
