
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { InfoIcon, TrendingDown, TrendingUp, Minus, ChevronRight, Calendar, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  const [selectedBiomarker, setSelectedBiomarker] = useState<Biomarker | null>(null);

  if (!biomarkers || biomarkers.length === 0) {
    return (
      <div className="text-center py-12 px-4 border border-dashed rounded-lg border-muted-foreground/50">
        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No biomarker data found</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Upload your lab test results or medical reports to see your biomarker data here.
        </p>
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

  const getStatusDescription = (status: 'normal' | 'elevated' | 'low' | 'critical', biomarker: string) => {
    switch (status) {
      case 'normal':
        return `Your ${biomarker} levels are within the normal range, which is optimal for health.`;
      case 'elevated':
        return `Your ${biomarker} levels are higher than the normal range, which may require attention.`;
      case 'low':
        return `Your ${biomarker} levels are lower than the normal range, which may require attention.`;
      case 'critical':
        return `Your ${biomarker} levels are significantly outside the normal range and require immediate medical attention.`;
      default:
        return '';
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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {biomarkers.map((biomarker) => (
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
                  {getTrendIcon(biomarker.trend, biomarker.status)}
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
                onClick={() => setSelectedBiomarker(biomarker)}
              >
                View Details
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </motion.div>
        ))}
      </div>

      <Dialog open={!!selectedBiomarker} onOpenChange={(open) => !open && setSelectedBiomarker(null)}>
        <DialogContent className="md:max-w-xl">
          {selectedBiomarker && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedBiomarker.name}
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusBgColor(selectedBiomarker.status)}`}>
                    {selectedBiomarker.status.charAt(0).toUpperCase() + selectedBiomarker.status.slice(1)}
                  </span>
                </DialogTitle>
                <DialogDescription>
                  Detailed information about your {selectedBiomarker.name} biomarker
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Current Value</span>
                    <span className="text-xl font-bold">{selectedBiomarker.value} <span className="text-sm font-normal">{selectedBiomarker.unit}</span></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Normal Range</span>
                    <span>{selectedBiomarker.normalRange} {selectedBiomarker.unit}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Status</span>
                    <span className={`${getStatusColor(selectedBiomarker.status)}`}>
                      {selectedBiomarker.status.charAt(0).toUpperCase() + selectedBiomarker.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Last Updated</span>
                    <span>{formatDate(selectedBiomarker.timestamp)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Trend</span>
                    <span className="flex items-center">
                      {getTrendIcon(selectedBiomarker.trend, selectedBiomarker.status)}
                      {selectedBiomarker.trend === 'stable' ? 'Stable' : selectedBiomarker.trend === 'up' ? 'Increasing' : 'Decreasing'}
                    </span>
                  </div>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">What does this mean?</h4>
                  <p className="text-sm">{getStatusDescription(selectedBiomarker.status, selectedBiomarker.name)}</p>
                  {selectedBiomarker.description && (
                    <div className="mt-2">
                      <h4 className="font-medium mb-1">About this biomarker</h4>
                      <p className="text-sm">{selectedBiomarker.description}</p>
                    </div>
                  )}
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Recommendations</h4>
                  <div className="text-sm">
                    {selectedBiomarker.status === 'normal' ? (
                      <p>Your levels are in the normal range. Continue with current lifestyle and diet.</p>
                    ) : selectedBiomarker.status === 'elevated' ? (
                      <ul className="list-disc ml-4 space-y-1">
                        <li>Consider discussing with your healthcare provider</li>
                        <li>Review your diet and lifestyle factors</li>
                        <li>Schedule a follow-up test in 3-6 months</li>
                      </ul>
                    ) : selectedBiomarker.status === 'low' ? (
                      <ul className="list-disc ml-4 space-y-1">
                        <li>Consult with your healthcare provider</li>
                        <li>You may need dietary supplements</li>
                        <li>Consider follow-up testing within 2-3 months</li>
                      </ul>
                    ) : (
                      <p className="text-red-500 font-medium">Contact your healthcare provider immediately for guidance.</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BiomarkerDisplay;
