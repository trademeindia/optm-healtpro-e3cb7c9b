
/**
 * Utility for monitoring and optimizing performance-critical operations
 */
export const performanceMonitor = {
  // Store timing metrics for different operations
  metrics: new Map<string, { count: number; totalTime: number; avgTime: number }>(),

  // Start timing an operation and return a function to end timing
  startTiming: (operationName: string) => {
    const startTime = performance.now();

    // Return a function to end timing and record metrics
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;

      // Update metrics for this operation
      if (!performanceMonitor.metrics.has(operationName)) {
        performanceMonitor.metrics.set(operationName, {
          count: 0,
          totalTime: 0,
          avgTime: 0
        });
      }

      const metric = performanceMonitor.metrics.get(operationName)!;
      metric.count += 1;
      metric.totalTime += duration;
      metric.avgTime = metric.totalTime / metric.count;

      // Log performance warnings for slow operations
      if (duration > 100) {
        console.warn(`Performance warning: ${operationName} took ${duration.toFixed(2)}ms`);
      }

      return duration;
    };
  },

  // Get metrics for a specific operation
  getMetrics: (operationName: string) => {
    return performanceMonitor.metrics.get(operationName);
  },

  // Get all performance metrics
  getAllMetrics: () => {
    return Object.fromEntries(performanceMonitor.metrics.entries());
  },

  // Reset metrics
  resetMetrics: () => {
    performanceMonitor.metrics.clear();
  }
};
