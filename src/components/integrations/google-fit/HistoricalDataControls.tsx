
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HistoricalDataControlsProps } from './types';

const HistoricalDataControls: React.FC<HistoricalDataControlsProps> = ({
  historyPeriod,
  setHistoryPeriod,
  historyDataType,
  setHistoryDataType
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <div className="w-full sm:w-1/2">
        <label className="text-sm font-medium mb-2 block">Time Period</label>
        <Select value={historyPeriod} onValueChange={setHistoryPeriod}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="90days">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-full sm:w-1/2">
        <label className="text-sm font-medium mb-2 block">Data Type</label>
        <Select value={historyDataType} onValueChange={setHistoryDataType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select data type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="steps">Steps</SelectItem>
            <SelectItem value="heart_rate">Heart Rate</SelectItem>
            <SelectItem value="calories">Calories</SelectItem>
            <SelectItem value="distance">Distance</SelectItem>
            <SelectItem value="sleep">Sleep Duration</SelectItem>
            <SelectItem value="active_minutes">Active Minutes</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default HistoricalDataControls;
