import React from 'react';
import { motion } from 'framer-motion';
import { InfoIcon, Calendar, ChevronRight } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TrendIndicator from './TrendIndicator';
import { BiomarkerCardProps } from './types';
import { getStatusBgColor, getStatusColor, formatDate } from './biomarkerUtils';

const BiomarkerCard: React.FC<BiomarkerCardProps> = ({ biomarker, onSelectBiomarker }) => {
  return (
    <motion.div
      key={biomarker.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="biomarker-card p-4 rounded-xl border border-border bg-card hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1">
          <h3 className="text-base font-medium">{biomarker.name}</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon className="w-4 h-4 text-muted-foreground ml-1" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Normal range: {biomarker.normalRange} {biomarker.unit}</p>
                {biomarker.description && <p className="mt-1">{biomarker.description}</p>}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBgColor(biomarker.status)}`}>
          {biomarker.status.charAt(0).toUpperCase() + biomarker.status.slice(1)}
        </span>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative h-20 w-20">
          <svg width="100%" height="100%" viewBox="0 0 100 100" className="rotate-[-90deg]">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              className="stroke-muted/20"
              strokeWidth="10"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              className={getStatusColor(biomarker.status)}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - (biomarker.percentage || 0) / 100)}`}
              style={{
                transition: 'stroke-dashoffset 1s ease-in-out',
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold">{biomarker.percentage}%</span>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="text-2xl font-bold mb-1 flex items-center">
            {biomarker.value} <span className="text-sm font-normal text-muted-foreground ml-1">{biomarker.unit}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Range: {biomarker.normalRange} {biomarker.unit}
          </div>
          <div className="flex items-center mt-1 text-xs">
            <TrendIndicator trend={biomarker.trend} status={biomarker.status} />
            <span>
              {biomarker.trend === 'stable' ? 'Stable' : biomarker.trend === 'up' ? 'Increasing' : 'Decreasing'}
            </span>
          </div>
          <div className="text-xs flex items-center gap-1 text-muted-foreground mt-1">
            <Calendar className="h-3 w-3" />
            {formatDate(biomarker.timestamp)}
          </div>
        </div>
      </div>
      
      <CardFooter className="px-0 mt-3 pt-3 border-t">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-between"
          onClick={() => onSelectBiomarker(biomarker)}
        >
          View Details
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </motion.div>
  );
};

export default BiomarkerCard;
