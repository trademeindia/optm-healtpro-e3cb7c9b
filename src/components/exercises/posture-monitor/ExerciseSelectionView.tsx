
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Info, DumbbellIcon, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

const ExerciseSelectionView: React.FC = () => {
  return (
    <Card className="visible-card shadow-md">
      <CardHeader className="bg-muted/30">
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          <span>Posture Monitor</span>
        </CardTitle>
        <CardDescription>
          Select an exercise to start posture analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        <div className="rounded-full bg-primary/10 p-6 mb-6">
          <DumbbellIcon className="h-12 w-12 text-primary" />
        </div>
        <h3 className="text-xl font-medium mb-2 high-contrast-text">Ready to Start</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Please select an exercise from the library to begin monitoring your posture and form
        </p>
        <Button className="flex items-center gap-2">
          Browse Exercises <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
      <CardFooter className="bg-muted/10 text-sm text-muted-foreground border-t">
        <p>AI-powered posture analysis will provide real-time feedback during your workout</p>
      </CardFooter>
    </Card>
  );
};

export default ExerciseSelectionView;
