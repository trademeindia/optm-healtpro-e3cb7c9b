
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TutorialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TutorialDialog: React.FC<TutorialDialogProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>How to Use Motion Tracker</DialogTitle>
          <DialogDescription>
            Follow these guidelines for the best tracking experience
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-1">Setup</h3>
            <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
              <li>Position your camera so your full body is visible</li>
              <li>Ensure the room has good lighting</li>
              <li>Wear clothing that contrasts with the background</li>
              <li>Clear the space around you for safe movement</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-1">During Exercise</h3>
            <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
              <li>Start in the standing position facing the camera</li>
              <li>Move slowly and with control for better tracking</li>
              <li>Follow the on-screen feedback to adjust your form</li>
              <li>Complete full repetitions for accurate counting</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-1">Troubleshooting</h3>
            <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
              <li>If tracking isn't working, check your lighting and position</li>
              <li>Try restarting the camera if detection stops</li>
              <li>Ensure your browser has permission to access your camera</li>
              <li>For best performance, use a recent version of Chrome or Firefox</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TutorialDialog;
