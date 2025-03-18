
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { HistoricalChartProps } from './types';

const HistoricalChart: React.FC<HistoricalChartProps> = ({
  historyData,
  historyDataType,
  isLoadingHistory
}) => {
  if (isLoadingHistory) {
    return <Skeleton className="h-[300px] w-full" />;
  }
  
  if (historyData.length > 0) {
    return (
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={historyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" name={historyDataType.replace('_', ' ')} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
  
  return (
    <div className="text-center py-8 text-muted-foreground">
      <p>No historical data available for the selected period.</p>
    </div>
  );
};

export default HistoricalChart;
