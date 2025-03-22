
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dumbbell, ArrowRight } from 'lucide-react';

const ExerciseSelectionView: React.FC = () => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-8 text-center">
        <Dumbbell className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No Exercise Selected</h3>
        <p className="text-muted-foreground mb-4">
          Please select an exercise from the list to begin your AI-powered workout session.
        </p>
        <div className="flex items-center text-sm text-primary">
          <span>Return to exercise list</span>
          <ArrowRight className="h-4 w-4 ml-1" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ExerciseSelectionView;
