
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

interface TutorialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TutorialDialog: React.FC<TutorialDialogProps> = ({
  open,
  onOpenChange
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>How to Use the Posture Monitor</DialogTitle>
          <DialogDescription>
            Follow these steps for the best AI-powered workout experience
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <div className="rounded-lg p-3 bg-muted/50">
            <h3 className="font-medium text-sm mb-1">1. Prepare Your Space</h3>
            <p className="text-sm text-muted-foreground">
              Ensure you have enough room to perform the exercise. Position your device so your 
              full body is visible in the camera.
            </p>
          </div>
          
          <div className="rounded-lg p-3 bg-muted/50">
            <h3 className="font-medium text-sm mb-1">2. Start the Camera</h3>
            <p className="text-sm text-muted-foreground">
              Click the "Start Camera" button and allow camera permissions when prompted.
              Position yourself so your full body is visible.
            </p>
          </div>
          
          <div className="rounded-lg p-3 bg-muted/50">
            <h3 className="font-medium text-sm mb-1">3. Follow the Guidance</h3>
            <p className="text-sm text-muted-foreground">
              The AI will analyze your movements and provide real-time feedback. Pay attention
              to form corrections and angle measurements.
            </p>
          </div>
          
          <div className="rounded-lg p-3 bg-muted/50">
            <h3 className="font-medium text-sm mb-1">4. Complete Your Session</h3>
            <p className="text-sm text-muted-foreground">
              Continue until you've completed your target number of repetitions. Click "Finish"
              when you're done to save your progress.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Got it</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TutorialDialog;
