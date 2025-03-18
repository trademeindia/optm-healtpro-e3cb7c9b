
import React from 'react';
import { HistoricalDataControlsProps } from './types';

const HistoricalDataControls: React.FC<HistoricalDataControlsProps> = ({
  historyPeriod,
  setHistoryPeriod,
  historyDataType,
  setHistoryDataType
}) => {
  return (
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
  );
};

export default HistoricalDataControls;
