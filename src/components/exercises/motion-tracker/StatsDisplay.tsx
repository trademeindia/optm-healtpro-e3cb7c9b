
import React from 'react';
import { Activity, Dumbbell } from 'lucide-react';

interface StatsDisplayProps {
  accuracy: number;
  reps: number;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ accuracy, reps }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex items-center gap-2 bg-muted p-3 rounded-lg">
        <div className="bg-primary/20 p-2 rounded-full">
          <Dumbbell className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium">Repetitions</p>
          <p className="text-2xl font-bold">{reps}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 bg-muted p-3 rounded-lg">
        <div className="bg-primary/20 p-2 rounded-full">
          <Activity className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium">Form Accuracy</p>
          <div className="flex items-center gap-2">
            <div className="w-full bg-muted-foreground/20 rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${accuracy}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium">{Math.round(accuracy)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsDisplay;
