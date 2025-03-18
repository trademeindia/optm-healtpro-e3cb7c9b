
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import HistoricalDataTab from '../tabs/HistoricalDataTab';

// Mock the Recharts components
vi.mock('recharts', () => ({
  BarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bar-chart">{children}</div>
  ),
  Bar: () => <div data-testid="bar">Bar</div>,
  XAxis: () => <div data-testid="x-axis">XAxis</div>,
  YAxis: () => <div data-testid="y-axis">YAxis</div>,
  CartesianGrid: () => <div data-testid="cartesian-grid">CartesianGrid</div>,
  Tooltip: () => <div data-testid="tooltip">Tooltip</div>,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  )
}));

// Mock the Skeleton component
vi.mock('@/components/ui/skeleton', () => ({
  Skeleton: ({ className }: { className: string }) => (
    <div data-testid="skeleton" className={className}>
      Loading...
    </div>
  )
}));

describe('HistoricalDataTab', () => {
  const defaultProps = {
    providerName: 'Google Fit',
    historyPeriod: '7days',
    setHistoryPeriod: vi.fn(),
    historyDataType: 'steps',
    setHistoryDataType: vi.fn(),
    historyData: [
      { date: 'Jan 01', value: 8000 },
      { date: 'Jan 02', value: 9000 },
      { date: 'Jan 03', value: 7500 }
    ],
    isLoadingHistory: false
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders the metric and period selectors', () => {
    render(<HistoricalDataTab {...defaultProps} />);

    expect(screen.getByText('Metric:')).toBeInTheDocument();
    expect(screen.getByText('Period:')).toBeInTheDocument();
    
    // Check that select elements exist with correct default values
    const metricSelect = screen.getByDisplayValue('steps');
    const periodSelect = screen.getByDisplayValue('7days');
    
    expect(metricSelect).toBeInTheDocument();
    expect(periodSelect).toBeInTheDocument();
  });

  test('calls setHistoryDataType when metric selector changes', () => {
    render(<HistoricalDataTab {...defaultProps} />);
    
    const metricSelect = screen.getByDisplayValue('steps');
    fireEvent.change(metricSelect, { target: { value: 'heart_rate' } });
    
    expect(defaultProps.setHistoryDataType).toHaveBeenCalledWith('heart_rate');
  });

  test('calls setHistoryPeriod when period selector changes', () => {
    render(<HistoricalDataTab {...defaultProps} />);
    
    const periodSelect = screen.getByDisplayValue('7days');
    fireEvent.change(periodSelect, { target: { value: '30days' } });
    
    expect(defaultProps.setHistoryPeriod).toHaveBeenCalledWith('30days');
  });

  test('renders loading skeleton when isLoadingHistory is true', () => {
    render(<HistoricalDataTab {...defaultProps} isLoadingHistory={true} />);
    
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument();
  });

  test('renders chart when data is available and not loading', () => {
    render(<HistoricalDataTab {...defaultProps} />);
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('bar')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
  });

  test('renders no data message when historyData is empty', () => {
    render(<HistoricalDataTab {...defaultProps} historyData={[]} />);
    
    expect(screen.getByText('No historical data available for the selected period.')).toBeInTheDocument();
    expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument();
  });

  test('handles all metric options in the selector', () => {
    render(<HistoricalDataTab {...defaultProps} />);
    
    const metricSelect = screen.getByDisplayValue('steps');
    
    expect(screen.getByText('Steps')).toBeInTheDocument();
    expect(screen.getByText('Heart Rate')).toBeInTheDocument();
    expect(screen.getByText('Calories')).toBeInTheDocument();
    expect(screen.getByText('Distance')).toBeInTheDocument();
    expect(screen.getByText('Sleep')).toBeInTheDocument();
    expect(screen.getByText('Active Minutes')).toBeInTheDocument();
  });

  test('handles all period options in the selector', () => {
    render(<HistoricalDataTab {...defaultProps} />);
    
    const periodSelect = screen.getByDisplayValue('7days');
    
    expect(screen.getByText('Last 7 Days')).toBeInTheDocument();
    expect(screen.getByText('Last 30 Days')).toBeInTheDocument();
    expect(screen.getByText('Last 90 Days')).toBeInTheDocument();
  });
});
