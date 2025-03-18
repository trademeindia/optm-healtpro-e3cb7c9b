
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export interface HistoricalDataPoint {
  date: string;
  value: number;
}

export const useHistoricalData = () => {
  const [historyPeriod, setHistoryPeriod] = useState('7days');
  const [historyDataType, setHistoryDataType] = useState('steps');
  const [historyData, setHistoryData] = useState<HistoricalDataPoint[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    fetchHistoricalData();
  }, [historyPeriod, historyDataType]);

  const fetchHistoricalData = () => {
    setIsLoadingHistory(true);
    
    // Simulate API call to get historical data
    setTimeout(() => {
      const endDate = new Date();
      const startDate = new Date();
      let days = 7;
      
      // Set start date based on selected period
      if (historyPeriod === '7days') {
        days = 7;
        startDate.setDate(endDate.getDate() - 7);
      } else if (historyPeriod === '30days') {
        days = 30;
        startDate.setDate(endDate.getDate() - 30);
      } else if (historyPeriod === '90days') {
        days = 90;
        startDate.setDate(endDate.getDate() - 90);
      }
      
      // Generate mock historical data
      const mockHistoricalData: HistoricalDataPoint[] = [];
      
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        let value: number;
        
        // Generate appropriate values based on data type
        switch (historyDataType) {
          case 'steps':
            value = Math.floor(5000 + Math.random() * 7000);
            break;
          case 'heart_rate':
            value = Math.floor(60 + Math.random() * 20);
            break;
          case 'calories':
            value = Math.floor(1000 + Math.random() * 1000);
            break;
          case 'distance':
            value = Math.floor(30 + Math.random() * 100) / 10;
            break;
          case 'sleep':
            value = Math.floor(5 + Math.random() * 4);
            break;
          case 'active_minutes':
            value = Math.floor(30 + Math.random() * 60);
            break;
          default:
            value = Math.random() * 100;
        }
        
        mockHistoricalData.push({
          date: format(date, 'MMM dd'),
          value
        });
      }
      
      // Sort by date (oldest to newest)
      mockHistoricalData.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });
      
      setHistoryData(mockHistoricalData);
      setIsLoadingHistory(false);
    }, 1000);
  };

  return {
    historyPeriod,
    setHistoryPeriod,
    historyDataType,
    setHistoryDataType,
    historyData,
    isLoadingHistory,
    fetchHistoricalData
  };
};
