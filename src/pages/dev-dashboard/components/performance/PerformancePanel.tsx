
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { PerformanceMetrics } from '../../types';
import BuildTimeChart from './BuildTimeChart';
import BundleSizeChart from './BundleSizeChart';
import PerformanceMetricsCards from './PerformanceMetricsCards';
import ResourceUsageChart from './ResourceUsageChart';

interface PerformancePanelProps {
  metrics: PerformanceMetrics;
  refreshMetrics: () => void;
}

const PerformancePanel: React.FC<PerformancePanelProps> = ({
  metrics,
  refreshMetrics
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Performance Metrics</h2>
          <p className="text-muted-foreground">
            Monitor build times, bundle sizes, and resource usage
          </p>
        </div>
        
        <Button onClick={refreshMetrics} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh Metrics
        </Button>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <PerformanceMetricsCards metrics={metrics} />
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <BuildTimeChart buildTimes={metrics.buildTimeHistory} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <BundleSizeChart bundleSizes={metrics.bundleSizeHistory} />
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <ResourceUsageChart 
          cpuUsage={metrics.resourceUsage.cpu}
          memoryUsage={metrics.resourceUsage.memory}
          diskUsage={metrics.resourceUsage.disk}
        />
      </motion.div>
    </div>
  );
};

export default PerformancePanel;
