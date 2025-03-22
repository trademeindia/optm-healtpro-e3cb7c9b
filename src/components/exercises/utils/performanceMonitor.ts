
/**
 * A utility for tracking and monitoring performance metrics in the motion tracking components
 */

type PerformanceMetric = {
  name: string;
  value: number;
  timestamp: number;
};

type PerformanceStats = {
  min: number;
  max: number;
  avg: number;
  current: number;
  samples: number;
};

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private maxSamples: number = 100;
  
  // Private constructor for singleton pattern
  private constructor() {}
  
  // Get the singleton instance
  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }
  
  // Record a performance metric
  public recordMetric(name: string, value: number): void {
    const timestamp = performance.now();
    
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    const metricsList = this.metrics.get(name)!;
    metricsList.push({ name, value, timestamp });
    
    // Trim list if it exceeds max samples
    if (metricsList.length > this.maxSamples) {
      metricsList.shift();
    }
  }
  
  // Start timing a specific operation
  public startTiming(name: string): () => void {
    const startTime = performance.now();
    
    // Return function to stop timing and record
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      this.recordMetric(name, duration);
    };
  }
  
  // Get stats for a specific metric
  public getStats(name: string): PerformanceStats | null {
    if (!this.metrics.has(name)) {
      return null;
    }
    
    const metricsList = this.metrics.get(name)!;
    if (metricsList.length === 0) {
      return null;
    }
    
    const values = metricsList.map(m => m.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const sum = values.reduce((acc, val) => acc + val, 0);
    const avg = sum / values.length;
    const current = values[values.length - 1];
    
    return {
      min,
      max,
      avg,
      current,
      samples: values.length
    };
  }
  
  // Get all metrics names
  public getMetricNames(): string[] {
    return Array.from(this.metrics.keys());
  }
  
  // Clear all metrics or a specific one
  public clearMetrics(name?: string): void {
    if (name) {
      this.metrics.delete(name);
    } else {
      this.metrics.clear();
    }
  }
  
  // Log performance stats to console
  public logStats(name?: string): void {
    if (name) {
      const stats = this.getStats(name);
      if (stats) {
        console.log(`Performance for "${name}":`, stats);
      } else {
        console.log(`No metrics recorded for "${name}"`);
      }
      return;
    }
    
    // Log all metrics
    const names = this.getMetricNames();
    if (names.length === 0) {
      console.log('No performance metrics recorded');
      return;
    }
    
    console.log('Performance Metrics:');
    names.forEach(metricName => {
      const stats = this.getStats(metricName);
      console.log(`- ${metricName}:`, stats);
    });
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// Utility functions for easy use
export const startTiming = (name: string) => performanceMonitor.startTiming(name);
export const recordMetric = (name: string, value: number) => performanceMonitor.recordMetric(name, value);
export const logPerformance = (name?: string) => performanceMonitor.logStats(name);
