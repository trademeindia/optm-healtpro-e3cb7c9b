
import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { toast } from 'sonner';
import { useDeviceSync, generateMockHealthData } from '../useDeviceSync';
import { FitnessProvider } from '@/components/dashboard/FitnessIntegrations';

// Mock dependencies
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe('useDeviceSync', () => {
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
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('returns initial state correctly', () => {
    const { result } = renderHook(() => useDeviceSync(mockProvider, mockHealthDataSyncFn));

    expect(result.current.isConnected).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.healthData).toEqual({});
    expect(result.current.lastSyncTime).toBeUndefined();
    expect(result.current.activeTab).toBe('current');
  });

  test('handles connect action correctly', async () => {
    const { result } = renderHook(() => useDeviceSync(mockProvider, mockHealthDataSyncFn));
    
    // Initial state
    expect(result.current.isConnected).toBe(false);
    
    // Act - trigger connect
    act(() => {
      result.current.handleConnect();
    });
    
    // Immediately after action - should be loading
    expect(result.current.isLoading).toBe(true);
    
    // Advance timer to complete the async operation
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    
    // Should now be connected with data
    expect(result.current.isConnected).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.lastSyncTime).toBeDefined();
    expect(Object.keys(result.current.healthData).length).toBeGreaterThan(0);
    expect(mockHealthDataSyncFn).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith(
      expect.stringContaining(`Connected to ${mockProvider.name}`),
      expect.any(Object)
    );
  });

  test('handles disconnect action correctly', async () => {
    // Setup - start with connected state
    const { result } = renderHook(() => useDeviceSync({ ...mockProvider, isConnected: true }, mockHealthDataSyncFn));
    
    // Set some initial mock data
    act(() => {
      result.current.handleConnect();
      vi.advanceTimersByTime(1500);
    });
    
    expect(result.current.isConnected).toBe(true);
    expect(Object.keys(result.current.healthData).length).toBeGreaterThan(0);
    
    // Act - trigger disconnect
    act(() => {
      result.current.handleDisconnect();
    });
    
    // Immediately after action - should be loading
    expect(result.current.isLoading).toBe(true);
    
    // Advance timer to complete the async operation
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    // Should now be disconnected with no data
    expect(result.current.isConnected).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.lastSyncTime).toBeUndefined();
    expect(result.current.healthData).toEqual({});
    expect(toast.success).toHaveBeenCalledWith(
      expect.stringContaining(`Disconnected from ${mockProvider.name}`),
      expect.any(Object)
    );
  });

  test('handles sync action correctly', async () => {
    // Setup - start with connected state
    const { result } = renderHook(() => useDeviceSync({ ...mockProvider, isConnected: true }, mockHealthDataSyncFn));
    
    // Set some initial mock data
    act(() => {
      result.current.handleConnect();
      vi.advanceTimersByTime(1500);
    });
    
    // Clear any previous calls
    mockHealthDataSyncFn.mockClear();
    
    // Store the initial last sync time
    const initialSyncTime = result.current.lastSyncTime;
    
    // Act - trigger sync
    act(() => {
      result.current.handleSync();
    });
    
    // Immediately after action - should be loading
    expect(result.current.isLoading).toBe(true);
    
    // Advance timer to complete the async operation
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    
    // Should have updated sync time and data
    expect(result.current.isLoading).toBe(false);
    expect(result.current.lastSyncTime).not.toBe(initialSyncTime);
    expect(mockHealthDataSyncFn).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith(
      expect.stringContaining(`Synced with ${mockProvider.name}`),
      expect.any(Object)
    );
  });

  test('generateMockHealthData creates valid health data', () => {
    const mockData = generateMockHealthData('Google Fit');
    
    expect(mockData.heartRate).toBeDefined();
    expect(mockData.steps).toBeDefined();
    expect(mockData.calories).toBeDefined();
    expect(mockData.distance).toBeDefined();
    expect(mockData.sleep).toBeDefined();
    expect(mockData.activeMinutes).toBeDefined();
    
    // Check structure of a health metric
    expect(mockData.heartRate).toMatchObject({
      name: 'Heart Rate',
      value: expect.any(Number),
      unit: 'bpm',
      timestamp: expect.any(String),
      change: expect.any(Number),
      source: 'Google Fit'
    });
  });

  test('setActiveTab changes the active tab', () => {
    const { result } = renderHook(() => useDeviceSync(mockProvider, mockHealthDataSyncFn));
    
    expect(result.current.activeTab).toBe('current');
    
    act(() => {
      result.current.setActiveTab('history');
    });
    
    expect(result.current.activeTab).toBe('history');
  });
});
