
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RefreshCw, Info } from 'lucide-react';
import { SystemStatus } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import SystemStatusCard from './SystemStatusCard';
import SystemStatusSummary from './SystemStatusSummary';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SystemCheckPanelProps {
  systemStatus: SystemStatus;
  runSystemCheck: () => void;
  lastChecked: Date | null;
}

const SystemCheckPanel: React.FC<SystemCheckPanelProps> = ({
  systemStatus,
  runSystemCheck,
  lastChecked
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  const categories = [
    { id: 'node', label: 'Node.js' },
    { id: 'npm', label: 'Package Manager' },
    { id: 'typescript', label: 'TypeScript' },
    { id: 'react', label: 'React' },
    { id: 'babel', label: 'Babel' },
    { id: 'eslint', label: 'ESLint' },
    { id: 'git', label: 'Git' },
    { id: 'bundler', label: 'Bundler' }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">System Health Check</h2>
          <p className="text-muted-foreground">
            Verify all dependencies and tools are properly installed and configured
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {lastChecked && (
            <span className="text-sm text-muted-foreground">
              Last check: {formatDistanceToNow(lastChecked, { addSuffix: true })}
            </span>
          )}
          
          <Button onClick={runSystemCheck} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Run System Check
          </Button>
        </div>
      </div>
      
      <SystemStatusSummary systemStatus={systemStatus} />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        {categories.map((category) => (
          <motion.div key={category.id} variants={itemVariants}>
            <SystemStatusCard 
              title={category.label}
              status={systemStatus[category.id]?.status || 'loading'}
              message={systemStatus[category.id]?.message || 'Checking...'}
              details={systemStatus[category.id]?.details || []}
            />
          </motion.div>
        ))}
      </motion.div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-100 flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">Why is system health important?</p>
          <p className="mt-1">
            A healthy development environment ensures consistent builds, prevents unexpected errors, and improves development productivity. Regular system checks help identify issues before they impact your workflow.
          </p>
          <div className="mt-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="link" className="h-auto p-0 text-blue-600 dark:text-blue-400">
                    Learn more about environment setup
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>Comprehensive documentation about environment configuration, requirements, and troubleshooting common issues.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemCheckPanel;
