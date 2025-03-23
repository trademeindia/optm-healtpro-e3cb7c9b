
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import { SystemStatus } from '../../types';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';

interface SystemStatusSummaryProps {
  systemStatus: SystemStatus;
}

const SystemStatusSummary: React.FC<SystemStatusSummaryProps> = ({ systemStatus }) => {
  const getStatusCounts = () => {
    let success = 0;
    let warning = 0;
    let error = 0;
    let total = 0;
    
    Object.values(systemStatus).forEach(status => {
      if (status) {
        total++;
        if (status.status === 'success') success++;
        if (status.status === 'warning') warning++;
        if (status.status === 'error') error++;
      }
    });
    
    return { success, warning, error, total };
  };
  
  const { success, warning, error, total } = getStatusCounts();
  const overallHealthPercentage = total > 0 ? Math.round((success / total) * 100) : 0;
  
  const getHealthColor = () => {
    if (error > 0) return 'text-red-500';
    if (warning > 0) return 'text-amber-500';
    return 'text-green-500';
  };
  
  const getProgressColor = () => {
    if (error > 0) return 'bg-red-500';
    if (warning > 0) return 'bg-amber-500';
    return 'bg-green-500';
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium mb-2">System Health</h3>
              <div className="flex items-center gap-1.5 mb-2">
                <span className={`text-3xl font-bold ${getHealthColor()}`}>
                  {overallHealthPercentage}%
                </span>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Overall health</span>
                  {error > 0 ? (
                    <span className="text-xs text-red-500">Critical issues detected</span>
                  ) : warning > 0 ? (
                    <span className="text-xs text-amber-500">Warnings detected</span>
                  ) : (
                    <span className="text-xs text-green-500">All systems operational</span>
                  )}
                </div>
              </div>
              <Progress 
                value={overallHealthPercentage} 
                className="h-2.5 mb-4"
                indicatorClassName={getProgressColor()}
              />
              <p className="text-sm text-muted-foreground">
                {error > 0 
                  ? 'Some critical issues need your attention.' 
                  : warning > 0 
                    ? 'System is operational but has some warnings.' 
                    : 'All dependencies and services are running properly.'}
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-2 md:col-span-2">
              <div className="bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900 rounded-lg p-3 flex flex-col items-center justify-center">
                <CheckCircle className="h-6 w-6 mb-1 text-green-500" />
                <span className="text-xl font-bold text-green-700 dark:text-green-400">{success}</span>
                <span className="text-xs text-green-600 dark:text-green-400">Passing</span>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 rounded-lg p-3 flex flex-col items-center justify-center">
                <AlertTriangle className="h-6 w-6 mb-1 text-amber-500" />
                <span className="text-xl font-bold text-amber-700 dark:text-amber-400">{warning}</span>
                <span className="text-xs text-amber-600 dark:text-amber-400">Warnings</span>
              </div>
              
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 rounded-lg p-3 flex flex-col items-center justify-center">
                <AlertCircle className="h-6 w-6 mb-1 text-red-500" />
                <span className="text-xl font-bold text-red-700 dark:text-red-400">{error}</span>
                <span className="text-xs text-red-600 dark:text-red-400">Errors</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SystemStatusSummary;
