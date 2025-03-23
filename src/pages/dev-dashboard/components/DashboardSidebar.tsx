
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  AlertCircle, 
  Folder, 
  Package, 
  BarChart3, 
  Settings,
  AlertTriangle 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SystemStatus } from '../types';

interface DashboardSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  systemStatus: SystemStatus;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  isOpen,
  activeTab,
  setActiveTab,
  systemStatus
}) => {
  const menuItems = [
    {
      id: 'system',
      label: 'System Check',
      icon: CheckCircle
    },
    {
      id: 'project',
      label: 'Project Info',
      icon: Folder
    },
    {
      id: 'dependencies',
      label: 'Dependencies',
      icon: Package
    },
    {
      id: 'performance',
      label: 'Performance',
      icon: BarChart3
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings
    }
  ];
  
  const getStatusIcon = (id: string) => {
    if (!systemStatus[id]) return null;
    
    if (systemStatus[id].status === 'error') {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    
    if (systemStatus[id].status === 'warning') {
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    }
    
    return null;
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 240, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full bg-gray-900 text-white flex flex-col shadow-lg z-20 overflow-hidden"
        >
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Dev Dashboard
            </h2>
            <p className="text-xs text-gray-400 mt-1">Environment monitoring tool</p>
          </div>
          
          <nav className="flex-1 py-4">
            <ul className="space-y-1 px-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <Button 
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 text-gray-300 hover:text-white hover:bg-gray-800",
                      activeTab === item.id && "bg-gray-800 text-white"
                    )}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                    {getStatusIcon(item.id)}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-green-500"></div>
              <span>Development Mode</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">v1.0.0</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DashboardSidebar;
