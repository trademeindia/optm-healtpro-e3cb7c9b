
/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom/vitest" />

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { toast } from 'sonner';
import DeviceSyncPanel from '../DeviceSyncPanel';
import { FitnessProvider } from '@/components/dashboard/FitnessIntegrations';
import { FitnessData } from '@/hooks/useFitnessIntegration';

// Mock components and hooks
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

vi.mock('date-fns', () => ({
  format: vi.fn().mockImplementation(() => 'January 1, 2023')
}));

vi.mock('../useDeviceSync', () => ({
  useDeviceSync: vi.fn().mockImplementation((provider, onHealthDataSync) => ({
    isConnected: false,
    isLoading: false,
    healthData: {},
    lastSyncTime: undefined,
    activeTab: 'current',
    setActiveTab: vi.fn(),
    handleConnect: vi.fn().mockImplementation(() => {
      // Simulate provider connection
      provider.isConnected = true;
      if (onHealthDataSync) {
        onHealthDataSync({
          heartRate: {
            name: 'Heart Rate',
            value: 72,
            unit: 'bpm',
            timestamp: new Date().toISOString(),
            change: 5,
            source: provider.name
          }
        });
      }
    }),
    handleDisconnect: vi.fn(),
    handleSync: vi.fn()
  }))
}));

// Mock components
vi.mock('../LoadingView', () => ({
  default: () => <div data-testid="loading-view">Loading...</div>
}));

vi.mock('../ConnectView', () => ({
  default: ({ onConnect }: { onConnect: () => void }) => (
    <div data-testid="connect-view">
      <button onClick={onConnect} data-testid="connect-button">
        Connect
      </button>
    </div>
  )
}));

vi.mock('../SyncedDataView', () => ({
  default: ({
    onSync,
    setActiveTab
  }: {
    onSync: () => void;
    setActiveTab: (tab: string) => void;
  }) => (
    <div data-testid="synced-data-view">
      <button onClick={onSync} data-testid="sync-button">
        Sync Now
      </button>
      <button onClick={() => setActiveTab('history')} data-testid="history-tab-button">
        Show History
      </button>
    </div>
  )
}));

describe('DeviceSyncPanel', () => {
  const mockProvider: FitnessProvider = {
    id: 'google_fit',
    name: 'Google Fit',
    logo: '/path/to/logo.png',
    isConnected: false,
    metrics: ['Heart Rate', 'Steps']
  };

  const mockHealthDataSyncFn = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders correctly when not connected', () => {
    render(
      <DeviceSyncPanel
        provider={mockProvider}
        onHealthDataSync={mockHealthDataSyncFn}
      />
    );

    expect(screen.getByText('Google Fit Integration')).toBeInTheDocument();
    expect(screen.getByText('Sync your health and fitness data')).toBeInTheDocument();
    expect(screen.getByTestId('connect-view')).toBeInTheDocument();
    expect(screen.queryByTestId('synced-data-view')).not.toBeInTheDocument();
  });

  test('renders loading state when isLoading is true', () => {
    vi.mocked(require('../useDeviceSync').useDeviceSync).mockReturnValueOnce({
      isConnected: false,
      isLoading: true,
      healthData: {},
      lastSyncTime: undefined,
      activeTab: 'current',
      setActiveTab: vi.fn(),
      handleConnect: vi.fn(),
      handleDisconnect: vi.fn(),
      handleSync: vi.fn()
    });

    render(
      <DeviceSyncPanel
        provider={mockProvider}
        onHealthDataSync={mockHealthDataSyncFn}
      />
    );

    expect(screen.getByTestId('loading-view')).toBeInTheDocument();
  });

  test('handles connect action correctly', async () => {
    const { useDeviceSync } = require('../useDeviceSync');
    const mockHandleConnect = vi.fn();
    
    useDeviceSync.mockReturnValueOnce({
      isConnected: false,
      isLoading: false,
      healthData: {},
      lastSyncTime: undefined,
      activeTab: 'current',
      setActiveTab: vi.fn(),
      handleConnect: mockHandleConnect,
      handleDisconnect: vi.fn(),
      handleSync: vi.fn()
    });

    render(
      <DeviceSyncPanel
        provider={mockProvider}
        onHealthDataSync={mockHealthDataSyncFn}
      />
    );

    fireEvent.click(screen.getByTestId('connect-button'));
    expect(mockHandleConnect).toHaveBeenCalledTimes(1);
  });

  test('handles disconnect action correctly', async () => {
    const { useDeviceSync } = require('../useDeviceSync');
    const mockHandleDisconnect = vi.fn();
    
    useDeviceSync.mockReturnValueOnce({
      isConnected: true,
      isLoading: false,
      healthData: { heartRate: { name: 'Heart Rate', value: 72, unit: 'bpm', timestamp: 'timestamp', source: 'Google Fit' } },
      lastSyncTime: '10:00 AM',
      activeTab: 'current',
      setActiveTab: vi.fn(),
      handleConnect: vi.fn(),
      handleDisconnect: mockHandleDisconnect,
      handleSync: vi.fn()
    });

    render(
      <DeviceSyncPanel
        provider={mockProvider}
        onHealthDataSync={mockHealthDataSyncFn}
      />
    );

    fireEvent.click(screen.getByText('Disconnect'));
    expect(mockHandleDisconnect).toHaveBeenCalledTimes(1);
  });

  test('renders synced data view when connected', () => {
    vi.mocked(require('../useDeviceSync').useDeviceSync).mockReturnValueOnce({
      isConnected: true,
      isLoading: false,
      healthData: {
        heartRate: {
          name: 'Heart Rate',
          value: 72,
          unit: 'bpm',
          timestamp: 'timestamp',
          source: 'Google Fit'
        }
      },
      lastSyncTime: '10:00 AM',
      activeTab: 'current',
      setActiveTab: vi.fn(),
      handleConnect: vi.fn(),
      handleDisconnect: vi.fn(),
      handleSync: vi.fn()
    });

    render(
      <DeviceSyncPanel
        provider={mockProvider}
        onHealthDataSync={mockHealthDataSyncFn}
      />
    );

    expect(screen.getByTestId('synced-data-view')).toBeInTheDocument();
    expect(screen.getByText('Last synchronized: January 1, 2023 at 10:00 AM')).toBeInTheDocument();
  });

  test('handles sync action correctly', async () => {
    const { useDeviceSync } = require('../useDeviceSync');
    const mockHandleSync = vi.fn();
    
    useDeviceSync.mockReturnValueOnce({
      isConnected: true,
      isLoading: false,
      healthData: { heartRate: { name: 'Heart Rate', value: 72, unit: 'bpm', timestamp: 'timestamp', source: 'Google Fit' } },
      lastSyncTime: '10:00 AM',
      activeTab: 'current',
      setActiveTab: vi.fn(),
      handleConnect: vi.fn(),
      handleDisconnect: vi.fn(),
      handleSync: mockHandleSync
    });

    render(
      <DeviceSyncPanel
        provider={mockProvider}
        onHealthDataSync={mockHealthDataSyncFn}
      />
    );

    fireEvent.click(screen.getByTestId('sync-button'));
    expect(mockHandleSync).toHaveBeenCalledTimes(1);
  });
});
