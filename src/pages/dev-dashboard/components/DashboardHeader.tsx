
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Search, Bell, RefreshCw, Menu, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SystemStatus } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DashboardHeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
  systemStatus: SystemStatus;
  runSystemCheck: () => void;
  lastChecked: Date | null;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  toggleSidebar,
  sidebarOpen,
  systemStatus,
  runSystemCheck,
  lastChecked
}) => {
  const getStatusColor = () => {
    const totalErrors = Object.values(systemStatus).filter(status => status.status === 'error').length;
    const totalWarnings = Object.values(systemStatus).filter(status => status.status === 'warning').length;
    
    if (totalErrors > 0) return 'bg-red-500';
    if (totalWarnings > 0) return 'bg-amber-500';
    return 'bg-green-500';
  };
  
  const getStatusText = () => {
    const totalErrors = Object.values(systemStatus).filter(status => status.status === 'error').length;
    const totalWarnings = Object.values(systemStatus).filter(status => status.status === 'warning').length;
    
    if (totalErrors > 0) return `${totalErrors} Error${totalErrors > 1 ? 's' : ''}`;
    if (totalWarnings > 0) return `${totalWarnings} Warning${totalWarnings > 1 ? 's' : ''}`;
    return 'All Systems Operational';
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-10"
    >
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="mr-2"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        
        <h1 className="text-xl font-bold mr-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden md:block">
          Dev Dashboard
        </h1>
        
        <div className="flex items-center gap-2">
          <Badge className={`${getStatusColor()} text-white`}>
            {getStatusText()}
          </Badge>
          
          {lastChecked && (
            <span className="text-xs text-muted-foreground hidden md:inline-block">
              Last check: {formatDistanceToNow(lastChecked, { addSuffix: true })}
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="relative w-48 mr-2 hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input 
            placeholder="Search..." 
            className="pl-9 h-9"
          />
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={runSystemCheck}
                className="h-9 w-9"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Run system check
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className="h-9 w-9 relative"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  3
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Notifications
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </motion.div>
  );
};

export default DashboardHeader;
