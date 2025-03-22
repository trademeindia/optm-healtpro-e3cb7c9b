
import React from 'react';
import { CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

interface StatsDisplayProps {
  accuracy: number;
  reps: number;
  incorrectReps: number;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({
  accuracy,
  reps,
  incorrectReps
}) => {
  return (
    <div className="grid grid-cols-3 gap-2 text-center">
      <div className="flex flex-col items-center bg-muted/50 rounded-md p-3">
        <div className="flex items-center justify-center bg-primary/10 rounded-full p-2 mb-2">
          <TrendingUp className="h-4 w-4 text-primary" />
        </div>
        <div className="text-2xl font-bold">{reps}</div>
        <div className="text-xs text-muted-foreground">Total Reps</div>
      </div>

      <div className="flex flex-col items-center bg-muted/50 rounded-md p-3">
        <div className="flex items-center justify-center bg-green-500/10 rounded-full p-2 mb-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
        </div>
        <div className="text-2xl font-bold">{reps - incorrectReps}</div>
        <div className="text-xs text-muted-foreground">Good Form</div>
      </div>

      <div className="flex flex-col items-center bg-muted/50 rounded-md p-3">
        <div className="flex items-center justify-center bg-amber-500/10 rounded-full p-2 mb-2">
          <AlertCircle className="h-4 w-4 text-amber-500" />
        </div>
        <div className="text-2xl font-bold">{accuracy}%</div>
        <div className="text-xs text-muted-foreground">Accuracy</div>
      </div>
    </div>
  );
};

export default StatsDisplay;
