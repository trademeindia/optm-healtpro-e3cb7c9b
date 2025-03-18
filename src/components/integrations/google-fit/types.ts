
import { FitnessData } from '@/hooks/useFitnessIntegration';

export interface GoogleFitSyncPanelProps {
  onHealthDataSync?: (data: FitnessData) => void;
  className?: string;
}

export interface HistoricalChartProps {
  historyData: any[];
  historyDataType: string;
  isLoadingHistory: boolean;
}

export interface ConnectionStatusProps {
  isConnected: boolean;
  isLoading: boolean;
  handleConnect: () => void;
}

export interface MetricIconProps {
  metricName: string;
}

export interface HistoricalDataControlsProps {
  historyPeriod: string;
  setHistoryPeriod: (period: string) => void;
  historyDataType: string;
  setHistoryDataType: (type: string) => void;
}
