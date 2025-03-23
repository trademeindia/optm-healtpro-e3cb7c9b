
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, PersonStanding, MessageSquare } from 'lucide-react';

const ExerciseInstructions: React.FC = () => {
  return (
    <Card className="shadow-sm border-b-4 border-b-indigo-500/40">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="bg-indigo-500/10 p-1.5 rounded-full">
            <MessageSquare className="h-4 w-4 text-indigo-500" />
          </div>
          <span>Exercise Instructions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Video className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-medium">Position Yourself</h4>
            <p className="text-sm text-muted-foreground">
              Stand 5-6 feet away from your camera so your entire body is visible.
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <PersonStanding className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-medium">Perform the Exercise</h4>
            <p className="text-sm text-muted-foreground">
              Perform exercises with proper form. Keep your back straight and maintain alignment throughout the movement.
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <MessageSquare className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-medium">Follow Feedback</h4>
            <p className="text-sm text-muted-foreground">
              Watch the real-time feedback and adjust your form based on the AI recommendations.
            </p>
          </div>
        </div>
        
        <div className="mt-2 pt-2 border-t border-dashed border-muted">
          <p className="text-xs text-muted-foreground italic">
            For best results, wear form-fitting clothing and ensure your full body is visible in the camera frame.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExerciseInstructions;
