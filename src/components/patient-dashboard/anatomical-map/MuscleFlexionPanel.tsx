
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity } from 'lucide-react';
import { MuscleFlexion } from './types';
import { getFlexionStatusColor, getFlexionProgressColor } from './utils';

interface MuscleFlexionPanelProps {
  flexionData: MuscleFlexion[];
}

const MuscleFlexionPanel: React.FC<MuscleFlexionPanelProps> = ({ flexionData }) => {
  return (
    <div className="mt-4 border rounded-md p-3 bg-card">
      <div className="flex items-center mb-2">
        <Activity className="h-4 w-4 mr-1.5 text-primary" />
        <h3 className="text-sm font-semibold">Muscle Flexion Assessment</h3>
        <span className="text-xs text-muted-foreground ml-2">Last updated: {flexionData[0]?.lastReading}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {flexionData.map((item, index) => (
          <div key={index} className="border p-2 rounded-md bg-background">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <span className="text-sm font-medium">{item.muscle}</span>
                <Badge className="ml-2 text-xs" variant="outline">
                  <span className={getFlexionStatusColor(item.status)}>{item.status}</span>
                </Badge>
              </div>
              <div className="text-sm font-bold">{item.flexionPercentage}%</div>
            </div>
            <Progress 
              value={item.flexionPercentage} 
              className="h-2" 
              indicatorClassName={getFlexionProgressColor(item.status)}
            />
            <div className="flex items-center mt-2">
              <span className="text-xs text-muted-foreground">
                {item.status === 'weak' && 'Strength training recommended'}
                {item.status === 'overworked' && 'Rest and recovery needed'}
                {item.status === 'healthy' && 'Optimal performance'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MuscleFlexionPanel;
