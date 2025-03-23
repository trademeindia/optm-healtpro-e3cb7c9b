
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

interface StatsDisplayProps {
  accuracy: number;
  reps: number;
  incorrectReps: number;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ accuracy, reps, incorrectReps }) => {
  // Function to determine accuracy color
  const getAccuracyColor = () => {
    if (accuracy >= 80) return 'bg-green-500';
    if (accuracy >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="border shadow-sm visible-card">
      <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4">
        <div className="bg-card shadow-sm rounded-lg p-3 border border-border/50">
          <p className="text-sm font-medium mb-2 high-contrast-text">Form Accuracy</p>
          <Progress 
            value={accuracy} 
            className="h-2 mb-2" 
            style={{ 
              "--progress-color": accuracy < 30 ? '#ef4444' : 
                                accuracy < 70 ? '#f59e0b' : '#10b981'
            } as React.CSSProperties}
          />
          <p className="text-xs text-right text-muted-foreground">{accuracy.toFixed(0)}%</p>
        </div>
        <div className="bg-card shadow-sm rounded-lg p-3 border border-border/50">
          <p className="text-sm font-medium mb-2 high-contrast-text">Good Reps</p>
          <div className="text-2xl font-bold text-green-600 stat-number">{reps}</div>
          <p className="text-xs text-muted-foreground">Correct form</p>
        </div>
        <div className="bg-card shadow-sm rounded-lg p-3 border border-border/50">
          <p className="text-sm font-medium mb-2 high-contrast-text">Incorrect Reps</p>
          <div className="text-2xl font-bold text-amber-600 stat-number">{incorrectReps}</div>
          <p className="text-xs text-muted-foreground">Needs improvement</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsDisplay;
