
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface StatsDisplayProps {
  accuracy: number;
  reps: number;
  incorrectReps: number;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ accuracy, reps, incorrectReps }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <p className="text-sm font-medium mb-1">Form Accuracy</p>
        <Progress value={accuracy} className="h-2" />
        <p className="text-xs text-right mt-1 text-muted-foreground">{accuracy}%</p>
      </div>
      <div>
        <p className="text-sm font-medium mb-1">Good Reps</p>
        <div className="text-2xl font-bold text-green-600">{reps}</div>
        <p className="text-xs text-muted-foreground">Correct form</p>
      </div>
      <div>
        <p className="text-sm font-medium mb-1">Incorrect Reps</p>
        <div className="text-2xl font-bold text-amber-600">{incorrectReps}</div>
        <p className="text-xs text-muted-foreground">Needs improvement</p>
      </div>
    </div>
  );
};

export default StatsDisplay;
