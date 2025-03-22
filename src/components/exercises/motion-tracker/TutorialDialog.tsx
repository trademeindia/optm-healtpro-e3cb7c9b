
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check } from 'lucide-react';

interface TutorialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TutorialDialog: React.FC<TutorialDialogProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>How to Use Motion Tracker</DialogTitle>
          <DialogDescription>
            Get the most out of your exercise session with AI-powered motion tracking
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <h3 className="font-medium text-lg">Getting Started</h3>
          
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <div className="bg-primary/20 p-1 rounded-full mt-0.5">
                <Check className="h-3 w-3 text-primary" />
              </div>
              <p className="text-sm">Position your camera so your full body is visible</p>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="bg-primary/20 p-1 rounded-full mt-0.5">
                <Check className="h-3 w-3 text-primary" />
              </div>
              <p className="text-sm">Ensure you have good lighting for optimal tracking</p>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="bg-primary/20 p-1 rounded-full mt-0.5">
                <Check className="h-3 w-3 text-primary" />
              </div>
              <p className="text-sm">Click "Start Camera" to begin the motion tracking session</p>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="bg-primary/20 p-1 rounded-full mt-0.5">
                <Check className="h-3 w-3 text-primary" />
              </div>
              <p className="text-sm">Follow the real-time feedback to improve your form</p>
            </div>
          </div>
          
          <h3 className="font-medium text-lg pt-2">Tips for Better Results</h3>
          
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <div className="bg-primary/20 p-1 rounded-full mt-0.5">
                <Check className="h-3 w-3 text-primary" />
              </div>
              <p className="text-sm">Wear form-fitting clothing for more accurate tracking</p>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="bg-primary/20 p-1 rounded-full mt-0.5">
                <Check className="h-3 w-3 text-primary" />
              </div>
              <p className="text-sm">Clear the area to give yourself enough space to move</p>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="bg-primary/20 p-1 rounded-full mt-0.5">
                <Check className="h-3 w-3 text-primary" />
              </div>
              <p className="text-sm">Move at a moderate pace for better tracking accuracy</p>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="bg-primary/20 p-1 rounded-full mt-0.5">
                <Check className="h-3 w-3 text-primary" />
              </div>
              <p className="text-sm">Click "Reset Session" to start a new set of repetitions</p>
            </div>
          </div>
          
          <div className="bg-muted p-3 rounded-lg mt-4">
            <p className="text-sm text-muted-foreground">
              Your privacy is important to us. All motion tracking happens locally on your device
              and no video data is sent to our servers.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TutorialDialog;
