
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import SyncedDataView from '../SyncedDataView';
import { FitnessData } from '@/hooks/useFitnessIntegration';

// Mock components
vi.mock('../tabs/CurrentDataTab', () => ({
  default: ({ healthData }: { healthData: FitnessData }) => (
    <div data-testid="current-data-tab">
      {Object.keys(healthData).length > 0 ? 'Health data available' : 'No health data'}
    </div>
  )
}));

vi.mock('../tabs/HistoricalDataTab', () => ({
  default: () => <div data-testid="historical-data-tab">Historical data</div>
}));

describe('SyncedDataView', () => {
  const mockHealthData: FitnessData = {
    heartRate: {
      name: 'Heart Rate',
      value: 72,
      unit: 'bpm',
      timestamp: new Date().toISOString(),
      change: 5,
      source: 'Google Fit'
    },
    steps: {
      name: 'Steps',
      value: 8500,
      unit: 'steps',
      timestamp: new Date().toISOString(),
      change: 10,
      source: 'Google Fit'
    }
  };

  const mockProps = {
    providerName: 'Google Fit',
    lastSyncTime: '10:00 AM',
    healthData: mockHealthData,
    activeTab: 'current',
    setActiveTab: vi.fn(),
    isLoading: false,
    onSync: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders current data tab by default', () => {
    render(<SyncedDataView {...mockProps} />);

    expect(screen.getByTestId('current-data-tab')).toBeInTheDocument();
    expect(screen.queryByTestId('historical-data-tab')).not.toBeInTheDocument();
  });

  test('switches to historical data tab when clicked', () => {
    render(<SyncedDataView {...mockProps} />);

    fireEvent.click(screen.getByText('Historical Data'));
    expect(mockProps.setActiveTab).toHaveBeenCalledWith('history');
  });

  test('displays sync button and triggers sync when clicked', () => {
    render(<SyncedDataView {...mockProps} />);

    const syncButton = screen.getByText('Sync Now');
    expect(syncButton).toBeInTheDocument();
    
    fireEvent.click(syncButton);
    expect(mockProps.onSync).toHaveBeenCalledTimes(1);
  });

  test('disables sync button when loading', () => {
    render(<SyncedDataView {...mockProps} isLoading={true} />);

    const syncButton = screen.getByText('Sync Now').closest('button');
    expect(syncButton).toBeDisabled();
  });

  test('shows loading animation on sync button when loading', () => {
    render(<SyncedDataView {...mockProps} isLoading={true} />);

    // Check for animate-spin class on the RefreshCw icon
    const refreshIcon = screen.getByText('Sync Now').previousSibling;
    expect(refreshIcon).toHaveClass('animate-spin');
  });

  test('renders historical tab when activeTab is history', () => {
    render(<SyncedDataView {...mockProps} activeTab="history" />);

    expect(screen.getByTestId('historical-data-tab')).toBeInTheDocument();
    expect(screen.queryByTestId('current-data-tab')).not.toBeInTheDocument();
  });

  test('fetches historical data when getHistoricalData is provided', async () => {
    const mockGetHistoricalData = vi.fn().mockResolvedValue([
      { startTime: '2023-01-01', value: 8000 },
      { startTime: '2023-01-02', value: 9000 }
    ]);

    render(
      <SyncedDataView 
        {...mockProps} 
        activeTab="history" 
        getHistoricalData={mockGetHistoricalData} 
      />
    );

    // Should call getHistoricalData when tab is set to history
    await waitFor(() => {
      expect(mockGetHistoricalData).toHaveBeenCalled();
    });
  });
});
