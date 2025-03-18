
/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import CurrentDataTab from '../tabs/CurrentDataTab';
import { FitnessData } from '@/hooks/useFitnessIntegration';

// Mock the getMetricIcon function
vi.mock('../utils', () => ({
  getMetricIcon: () => vi.fn()
}));

// Mock HealthMetric component
vi.mock('@/components/dashboard/HealthMetric', () => ({
  default: ({ title, value, unit }: { title: string; value: number | string; unit: string }) => (
    <div data-testid={`health-metric-${title.toLowerCase().replace(' ', '-')}`}>
      {title}: {value} {unit}
    </div>
  )
}));

describe('CurrentDataTab', () => {
  const mockProviderName = 'Google Fit';
  const mockLastSyncTime = '10:00 AM';

  test('renders empty state when no health data is available', () => {
    render(
      <CurrentDataTab 
        healthData={{}} 
        providerName={mockProviderName}
        lastSyncTime={mockLastSyncTime}
      />
    );

    expect(screen.getByText(/No health data available/i)).toBeInTheDocument();
  });

  test('renders health metrics when data is available', () => {
    const mockHealthData: FitnessData = {
      steps: {
        name: 'Steps',
        value: 8500,
        unit: 'steps',
        timestamp: new Date().toISOString(),
        change: 10,
        source: mockProviderName
      },
      heartRate: {
        name: 'Heart Rate',
        value: 72,
        unit: 'bpm',
        timestamp: new Date().toISOString(),
        change: 5,
        source: mockProviderName
      }
    };

    render(
      <CurrentDataTab 
        healthData={mockHealthData} 
        providerName={mockProviderName}
        lastSyncTime={mockLastSyncTime}
      />
    );

    expect(screen.getByTestId('health-metric-steps')).toBeInTheDocument();
    expect(screen.getByTestId('health-metric-heart-rate')).toBeInTheDocument();
    expect(screen.getByText('Steps: 8500 steps')).toBeInTheDocument();
    expect(screen.getByText('Heart Rate: 72 bpm')).toBeInTheDocument();
  });

  test('renders all available health metrics', () => {
    const mockHealthData: FitnessData = {
      steps: {
        name: 'Steps',
        value: 8500,
        unit: 'steps',
        timestamp: new Date().toISOString(),
        change: 10,
        source: mockProviderName
      },
      heartRate: {
        name: 'Heart Rate',
        value: 72,
        unit: 'bpm',
        timestamp: new Date().toISOString(),
        change: 5,
        source: mockProviderName
      },
      calories: {
        name: 'Calories',
        value: 1200,
        unit: 'kcal',
        timestamp: new Date().toISOString(),
        change: 8,
        source: mockProviderName
      },
      distance: {
        name: 'Distance',
        value: 5.2,
        unit: 'km',
        timestamp: new Date().toISOString(),
        change: 12,
        source: mockProviderName
      },
      sleep: {
        name: 'Sleep',
        value: 7.5,
        unit: 'hours',
        timestamp: new Date().toISOString(),
        change: -2,
        source: mockProviderName
      },
      activeMinutes: {
        name: 'Active Minutes',
        value: 45,
        unit: 'min',
        timestamp: new Date().toISOString(),
        change: 15,
        source: mockProviderName
      }
    };

    render(
      <CurrentDataTab 
        healthData={mockHealthData} 
        providerName={mockProviderName}
        lastSyncTime={mockLastSyncTime}
      />
    );

    expect(screen.getByTestId('health-metric-steps')).toBeInTheDocument();
    expect(screen.getByTestId('health-metric-heart-rate')).toBeInTheDocument();
    expect(screen.getByTestId('health-metric-calories')).toBeInTheDocument();
    expect(screen.getByTestId('health-metric-distance')).toBeInTheDocument();
    expect(screen.getByTestId('health-metric-sleep')).toBeInTheDocument();
    expect(screen.getByTestId('health-metric-active-minutes')).toBeInTheDocument();
  });
});
