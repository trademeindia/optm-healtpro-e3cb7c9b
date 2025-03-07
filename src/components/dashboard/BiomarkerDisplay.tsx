
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { InfoIcon, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';

interface Biomarker {
  id: string;
  name: string;
  value: number;
  unit: string;
  normalRange: string;
  status: 'normal' | 'elevated' | 'low' | 'critical';
  timestamp: string;
  percentage?: number;
  trend?: 'up' | 'down' | 'stable';
  description?: string;
}

interface BiomarkerDisplayProps {
  biomarkers: Biomarker[];
}

const BiomarkerDisplay: React.FC<BiomarkerDisplayProps> = ({ biomarkers }) => {
  if (!biomarkers || biomarkers.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No biomarker data found for this patient
      </div>
    );
  }

  const getStatusColor = (status: 'normal' | 'elevated' | 'low' | 'critical') => {
    switch (status) {
      case 'normal':
        return 'text-green-500 stroke-green-500';
      case 'elevated':
        return 'text-yellow-500 stroke-yellow-500';
      case 'low':
        return 'text-blue-500 stroke-blue-500';
      case 'critical':
        return 'text-red-500 stroke-red-500';
      default:
        return 'text-green-500 stroke-green-500';
    }
  };

  const getStatusBgColor = (status: 'normal' | 'elevated' | 'low' | 'critical') => {
    switch (status) {
      case 'normal':
        return 'bg-green-100 text-green-800';
      case 'elevated':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable', status?: 'normal' | 'elevated' | 'low' | 'critical') => {
    if (!trend || trend === 'stable') {
      return <Minus className="w-4 h-4 mr-1 text-muted-foreground" />;
    }
    
    if (trend === 'up') {
      return <TrendingUp className={`w-4 h-4 mr-1 ${status === 'normal' ? 'text-green-500' : 'text-red-500'}`} />;
    }
    
    return <TrendingDown className={`w-4 h-4 mr-1 ${status === 'normal' ? 'text-green-500' : 'text-blue-500'}`} />;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {biomarkers.map((biomarker) => (
        <motion.div
          key={biomarker.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="biomarker-card p-4 rounded-xl border border-border bg-card"
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
                {getTrendIcon(biomarker.trend, biomarker.status)}
                <span>
                  {biomarker.trend === 'stable' ? 'Stable' : biomarker.trend === 'up' ? 'Increasing' : 'Decreasing'}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Last updated: {formatDate(biomarker.timestamp)}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default BiomarkerDisplay;
