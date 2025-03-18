
import React from 'react';
import HistoricalDataControls from './HistoricalDataControls';
import HistoricalChart from './HistoricalChart';

interface HistoricalDataTabProps {
  historyPeriod: string;
  setHistoryPeriod: (period: string) => void;
  historyDataType: string;
  setHistoryDataType: (type: string) => void;
  historyData: any[];
  isLoadingHistory: boolean;
}

const HistoricalDataTab: React.FC<HistoricalDataTabProps> = ({
  historyPeriod,
  setHistoryPeriod,
  historyDataType,
  setHistoryDataType,
  historyData,
  isLoadingHistory
}) => {
  return (
    <div className="space-y-4 mt-2">
      <HistoricalDataControls 
        historyPeriod={historyPeriod}
        setHistoryPeriod={setHistoryPeriod}
        historyDataType={historyDataType}
        setHistoryDataType={setHistoryDataType}
      />
      
      <HistoricalChart 
        historyData={historyData}
        historyDataType={historyDataType}
        isLoadingHistory={isLoadingHistory}
      />
    </div>
  );
};

export default HistoricalDataTab;
