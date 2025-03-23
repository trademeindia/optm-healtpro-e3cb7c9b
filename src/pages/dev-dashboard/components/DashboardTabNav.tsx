
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Folder, Package, BarChart3, Settings, AlertCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SystemStatus } from '../types';

interface DashboardTabNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  systemStatus: SystemStatus;
}

const DashboardTabNav: React.FC<DashboardTabNavProps> = ({
  activeTab,
  setActiveTab,
  systemStatus
}) => {
  const tabs = [
    { id: 'system', icon: CheckCircle, label: 'System' },
    { id: 'project', icon: Folder, label: 'Project' },
    { id: 'dependencies', icon: Package, label: 'Deps' },
    { id: 'performance', icon: BarChart3, label: 'Perf' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];
  
  const getStatusIcon = (id: string) => {
    if (!systemStatus[id]) return null;
    
    if (systemStatus[id].status === 'error') {
      return <AlertCircle className="absolute -top-1 -right-1 h-3 w-3 text-red-500" />;
    }
    
    if (systemStatus[id].status === 'warning') {
      return <AlertTriangle className="absolute -top-1 -right-1 h-3 w-3 text-amber-500" />;
    }
    
    return null;
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-between bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm mb-4"
    >
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? "default" : "ghost"}
          size="sm"
          className="flex flex-col items-center gap-1 h-auto py-2 relative"
          onClick={() => setActiveTab(tab.id)}
        >
          <tab.icon className="h-4 w-4" />
          <span className="text-xs">{tab.label}</span>
          {getStatusIcon(tab.id)}
        </Button>
      ))}
    </motion.div>
  );
};

export default DashboardTabNav;
