
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface HistoricalDataTabProps {
  providerName: string;
  historyPeriod: string;
  setHistoryPeriod: (period: string) => void;
  historyDataType: string;
  setHistoryDataType: (dataType: string) => void;
  historyData: any[];
  isLoadingHistory: boolean;
}

const HistoricalDataTab: React.FC<HistoricalDataTabProps> = ({ 
  providerName,
  historyPeriod,
  setHistoryPeriod,
  historyDataType,
  setHistoryDataType,
  historyData,
  isLoadingHistory
}) => {
  return (
    <>
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex items-center mr-4">
          <label className="text-sm mr-2">Metric:</label>
          <select 
            className="text-sm border rounded p-1"
            value={historyDataType}
            onChange={(e) => setHistoryDataType(e.target.value)}
          >
            <option value="steps">Steps</option>
            <option value="heart_rate">Heart Rate</option>
            <option value="calories">Calories</option>
            <option value="distance">Distance</option>
            <option value="sleep">Sleep</option>
            <option value="active_minutes">Active Minutes</option>
          </select>
        </div>
        
        <div className="flex items-center">
          <label className="text-sm mr-2">Period:</label>
          <select 
            className="text-sm border rounded p-1"
            value={historyPeriod}
            onChange={(e) => setHistoryPeriod(e.target.value)}
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
        </div>
      </div>
      
      {isLoadingHistory ? (
        <Skeleton className="h-[300px] w-full" />
      ) : historyData.length > 0 ? (
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
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>No historical data available for the selected period.</p>
        </div>
      )}
    </>
  );
};

export default HistoricalDataTab;
