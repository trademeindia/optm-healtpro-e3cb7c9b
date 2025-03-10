
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const DisclaimerFooter: React.FC = () => {
  return (
    <>
      <Separator className="my-6" />
      <div className="bg-muted/30 p-6 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="font-medium text-sm">Important Note:</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This information is for educational purposes only and should not replace professional medical advice. 
              Always consult with your healthcare provider about your test results and before making any changes to your health routine.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DisclaimerFooter;
