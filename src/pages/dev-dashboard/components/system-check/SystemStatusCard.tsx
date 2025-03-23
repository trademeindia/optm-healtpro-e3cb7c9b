
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SystemStatusCardProps {
  title: string;
  status: 'success' | 'error' | 'warning' | 'loading';
  message: string;
  details: string[];
}

const SystemStatusCard: React.FC<SystemStatusCardProps> = ({
  title,
  status,
  message,
  details
}) => {
  const [expanded, setExpanded] = useState(status === 'error' || status === 'warning');
  
  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      default:
        return (
          <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin"></div>
        );
    }
  };
  
  const getCardBorder = () => {
    switch (status) {
      case 'success':
        return 'border-green-200 dark:border-green-900';
      case 'error':
        return 'border-red-200 dark:border-red-900';
      case 'warning':
        return 'border-amber-200 dark:border-amber-900';
      default:
        return 'border-gray-200 dark:border-gray-700';
    }
  };
  
  return (
    <Card className={cn("transition-all", getCardBorder())}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span>{title}</span>
          </div>
          
          {details.length > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={() => setExpanded(!expanded)}
                  >
                    {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {expanded ? 'Show less' : 'Show details'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <p className={cn(
          "text-sm",
          status === 'error' ? 'text-red-600 dark:text-red-400' :
          status === 'warning' ? 'text-amber-600 dark:text-amber-400' :
          'text-gray-600 dark:text-gray-400'
        )}>
          {message}
        </p>
        
        {expanded && details.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-3 text-xs space-y-1"
          >
            {details.map((detail, index) => (
              <div 
                key={index} 
                className="flex items-start gap-2 text-gray-600 dark:text-gray-400"
              >
                <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span>{detail}</span>
              </div>
            ))}
          </motion.div>
        )}
      </CardContent>
      
      {status === 'error' && (
        <CardFooter className="pt-0">
          <Button variant="link" size="sm" className="h-auto p-0 text-red-600 dark:text-red-400">
            How to fix
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default SystemStatusCard;
