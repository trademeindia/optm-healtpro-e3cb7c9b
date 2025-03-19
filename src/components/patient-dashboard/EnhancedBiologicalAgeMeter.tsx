
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface EnhancedBiologicalAgeMeterProps {
  biologicalAge: number;
  chronologicalAge: number;
  className?: string;
}

const EnhancedBiologicalAgeMeter: React.FC<EnhancedBiologicalAgeMeterProps> = ({
  biologicalAge,
  chronologicalAge,
  className = ""
}) => {
  // Calculate difference and determine status
  const ageDifference = chronologicalAge - biologicalAge;
  const percentage = Math.min(100, Math.max(0, (biologicalAge / Math.max(chronologicalAge + 5, biologicalAge + 5)) * 100));
  
  const getStatusColor = () => {
    if (ageDifference >= 5) return 'text-green-500';
    if (ageDifference >= 0) return 'text-green-400';
    if (ageDifference >= -5) return 'text-amber-500';
    return 'text-orange-500';
  };

  const getProgressColor = () => {
    if (ageDifference >= 5) return 'from-green-300 to-green-500';
    if (ageDifference >= 0) return 'from-green-200 to-green-400';
    if (ageDifference >= -5) return 'from-amber-300 to-amber-500';
    return 'from-orange-300 to-orange-500';
  };

  const getStatusText = () => {
    if (ageDifference >= 5) return `Excellent: ${Math.abs(ageDifference)} years younger`;
    if (ageDifference >= 0) return `Good: ${Math.abs(ageDifference)} years younger`;
    if (ageDifference >= -5) return `Average: ${Math.abs(ageDifference)} years older`;
    return `Concern: ${Math.abs(ageDifference)} years older`;
  };

  return (
    <Card className={`shadow-md border-0 ${className}`}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center">
          <Clock className="h-5 w-5 mr-2 text-primary/80" />
          Biological Age
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex flex-col items-center">
          <div className="relative w-48 h-48">
            {/* Circular progress background */}
            <div className="absolute inset-0 rounded-full bg-gray-100 dark:bg-gray-800"></div>
            
            {/* Circular progress */}
            <div 
              className={`absolute inset-0 rounded-full bg-gradient-to-r ${getProgressColor()}`}
              style={{ 
                clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 ${100 - percentage}%)` 
              }}
            ></div>
            
            {/* Inner circle with content */}
            <div className="absolute inset-4 rounded-full bg-white dark:bg-gray-900 flex flex-col items-center justify-center shadow-inner">
              <div className="text-4xl font-bold">{biologicalAge}</div>
              <div className="text-sm text-muted-foreground">Biological Age</div>
              <div className="text-sm mt-1">vs</div>
              <div className="text-lg font-medium">{chronologicalAge} <span className="text-sm font-normal text-muted-foreground">actual</span></div>
            </div>
          </div>
          
          <div className={`mt-4 text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </div>
          
          <div className="mt-6 w-full">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Biological</span>
              <span>Chronological</span>
            </div>
            
            <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800 relative">
              <div 
                className={`h-2 rounded-full bg-gradient-to-r ${getProgressColor()}`}
                style={{ width: `${percentage}%` }}
              ></div>
              <div 
                className="absolute top-0 w-2 h-4 -mt-1 bg-gray-900 dark:bg-white rounded"
                style={{ left: `${(chronologicalAge / Math.max(chronologicalAge + 5, biologicalAge + 5)) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-xs mt-1">
              <span className="font-medium">{biologicalAge} yrs</span>
              <span className="font-medium">{chronologicalAge} yrs</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedBiologicalAgeMeter;
