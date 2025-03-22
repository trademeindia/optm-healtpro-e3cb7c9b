
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface TutorialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TutorialDialog: React.FC<TutorialDialogProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
        <DialogHeader className="border-b pb-3 mb-2">
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">How to Use AI Squat Analyzer</DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            Follow these steps to get accurate squat form analysis
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-3 text-sm text-gray-700 dark:text-gray-200">
          <div>
            <h3 className="font-semibold text-base mb-1 text-gray-900 dark:text-white">Setting Up</h3>
            <ol className="list-decimal list-inside space-y-1 pl-2">
              <li>Position your device so your full body is visible</li>
              <li>Ensure good lighting in the room</li>
              <li>Wear form-fitting clothing for better detection</li>
              <li>Clear the area around you for safety</li>
            </ol>
          </div>
          
          <div>
            <h3 className="font-semibold text-base mb-1 text-gray-900 dark:text-white">Performing Squats</h3>
            <ol className="list-decimal list-inside space-y-1 pl-2">
              <li>Stand facing the camera with feet shoulder-width apart</li>
              <li>Keep your back straight throughout the movement</li>
              <li>Lower your body by bending at the knees and hips</li>
              <li>Aim to get your thighs parallel to the ground</li>
              <li>Push through your heels to return to standing</li>
            </ol>
          </div>
          
          <div>
            <h3 className="font-semibold text-base mb-1 text-gray-900 dark:text-white">Understanding Feedback</h3>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Green feedback indicates good form</li>
              <li>Yellow feedback suggests minor adjustments</li>
              <li>Red feedback indicates form that should be corrected</li>
              <li>Your accuracy score reflects your overall form quality</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-base mb-1 text-gray-900 dark:text-white">Biomechanical Analysis</h3>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Click "Show Biomechanics" to see detailed analysis</li>
              <li>Joint angles show the position of your knees, hips, and ankles</li>
              <li>Muscle activation shows which muscles are working hardest</li>
              <li>Form assessment provides specific recommendations</li>
              <li>Analysis happens automatically when you reach the bottom of your squat</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-base mb-1 text-gray-900 dark:text-white">Tips for Best Results</h3>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Move slowly and with control</li>
              <li>Keep your movements smooth and deliberate</li>
              <li>Use a proper squat stance with toes slightly pointed out</li>
              <li>Complete full squat repetitions for accurate counting</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TutorialDialog;
