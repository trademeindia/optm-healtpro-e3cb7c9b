
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TutorialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TutorialDialog: React.FC<TutorialDialogProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>How to Use the Squat Analyzer</DialogTitle>
          <DialogDescription>
            Follow these steps for accurate squat form analysis
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <span className="flex items-center justify-center bg-primary text-primary-foreground rounded-full w-6 h-6 text-sm">1</span>
              Position Your Camera
            </h3>
            <p className="text-sm text-muted-foreground">
              Place your device so the camera can see your full body from a side view. Make sure you have enough space to perform a squat.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <span className="flex items-center justify-center bg-primary text-primary-foreground rounded-full w-6 h-6 text-sm">2</span>
              Proper Squat Form
            </h3>
            <p className="text-sm text-muted-foreground">
              • Stand with feet shoulder-width apart<br />
              • Keep your back straight<br />
              • Lower your hips as if sitting in a chair<br />
              • Knees should track over your toes<br />
              • Aim to get your thighs parallel to the ground<br />
              • Push through your heels to stand back up
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <span className="flex items-center justify-center bg-primary text-primary-foreground rounded-full w-6 h-6 text-sm">3</span>
              Understanding Feedback
            </h3>
            <p className="text-sm text-muted-foreground">
              The AI will analyze your knee and hip angles to provide real-time feedback on your form. Green messages indicate good form, while yellow messages suggest areas for improvement.
            </p>
          </div>
          
          <Button onClick={() => onOpenChange(false)} className="w-full">
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TutorialDialog;
