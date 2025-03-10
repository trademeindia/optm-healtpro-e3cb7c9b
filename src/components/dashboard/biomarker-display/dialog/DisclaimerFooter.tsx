
import React from 'react';
import { Separator } from '@/components/ui/separator';

const DisclaimerFooter: React.FC = () => {
  return (
    <>
      <Separator />
      <div className="text-xs text-muted-foreground">
        <p className="font-medium mb-1">Important Note:</p>
        <p>This information is for educational purposes only and should not replace professional medical advice. Always consult with your healthcare provider about your test results and before making any changes to your health routine.</p>
      </div>
    </>
  );
};

export default DisclaimerFooter;
