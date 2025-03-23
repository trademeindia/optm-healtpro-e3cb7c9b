
import { useState, useEffect } from 'react';
import { PerformanceMetrics, TimeSeriesDataPoint } from '../types';

export function usePerformanceMetrics() {
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    latestBuildTime: 12500, // 12.5 seconds
    totalBundleSize: 1458000, // 1.458 MB
    buildTimeChange: -8, // 8% faster
    bundleSizeChange: 5, // 5% larger
    performanceScore: 87,
    performanceScoreChange: 3, // 3% better
    
    buildTimeHistory: [
      { timestamp: '2023-07-01T10:00:00Z', duration: 15 },
      { timestamp: '2023-07-02T10:00:00Z', duration: 14.5 },
      { timestamp: '2023-07-03T10:00:00Z', duration: 14.8 },
      { timestamp: '2023-07-04T10:00:00Z', duration: 13.9 },
      { timestamp: '2023-07-05T10:00:00Z', duration: 13.2 },
      { timestamp: '2023-07-06T10:00:00Z', duration: 12.8 },
      { timestamp: '2023-07-07T10:00:00Z', duration: 12.5 }
    ],
    
    bundleSizeHistory: [
      { name: 'Main Bundle', js: 950000, css: 120000, assets: 280000 },
      { name: 'Dashboard', js: 420000, css: 85000, assets: 150000 },
      { name: 'Analytics', js: 380000, css: 65000, assets: 120000 },
      { name: 'Auth', js: 180000, css: 35000, assets: 90000 }
    ],
    
    resourceUsage: {
      cpu: 32, // 32% usage
      memory: 512000000, // 512 MB
      disk: 1073741824, // 1 GB
      cpuHistory: [
        { timestamp: '2023-07-07T09:30:00Z', value: 28 },
        { timestamp: '2023-07-07T09:35:00Z', value: 35 },
        { timestamp: '2023-07-07T09:40:00Z', value: 42 },
        { timestamp: '2023-07-07T09:45:00Z', value: 38 },
        { timestamp: '2023-07-07T09:50:00Z', value: 36 },
        { timestamp: '2023-07-07T09:55:00Z', value: 30 },
        { timestamp: '2023-07-07T10:00:00Z', value: 32 }
      ],
      memoryHistory: [
        { timestamp: '2023-07-07T09:30:00Z', value: 495000000 },
        { timestamp: '2023-07-07T09:35:00Z', value: 510000000 },
        { timestamp: '2023-07-07T09:40:00Z', value: 540000000 },
        { timestamp: '2023-07-07T09:45:00Z', value: 525000000 },
        { timestamp: '2023-07-07T09:50:00Z', value: 515000000 },
        { timestamp: '2023-07-07T09:55:00Z', value: 505000000 },
        { timestamp: '2023-07-07T10:00:00Z', value: 512000000 }
      ],
      diskHistory: [
        { timestamp: '2023-07-07T09:30:00Z', value: 950000000 },
        { timestamp: '2023-07-07T09:35:00Z', value: 980000000 },
        { timestamp: '2023-07-07T09:40:00Z', value: 1020000000 },
        { timestamp: '2023-07-07T09:45:00Z', value: 1050000000 },
        { timestamp: '2023-07-07T09:50:00Z', value: 1060000000 },
        { timestamp: '2023-07-07T09:55:00Z', value: 1070000000 },
        { timestamp: '2023-07-07T10:00:00Z', value: 1073741824 }
      ]
    }
  });

  const refreshMetrics = () => {
    // In a real implementation, this would fetch actual performance metrics
    // For demo purposes, we'll just pretend to refresh the data
    
    setPerformanceMetrics({
      ...performanceMetrics,
      latestBuildTime: performanceMetrics.latestBuildTime * (1 - Math.random() * 0.1),
      buildTimeChange: performanceMetrics.buildTimeChange - 2,
      performanceScore: Math.min(100, performanceMetrics.performanceScore + 1),
      performanceScoreChange: performanceMetrics.performanceScoreChange + 1
    });
  };

  return {
    performanceMetrics,
    refreshMetrics
  };
}
