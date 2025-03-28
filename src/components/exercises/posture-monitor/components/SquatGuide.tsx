
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const SquatGuide: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">How to Perform a Proper Squat</h3>
        
        <div className="space-y-4">
          <div className="step">
            <h4 className="font-medium">1. Starting Position</h4>
            <p className="text-sm text-muted-foreground">
              Stand with feet shoulder-width apart, toes pointing slightly outward.
              Keep your chest up and shoulders back.
            </p>
          </div>
          
          <div className="step">
            <h4 className="font-medium">2. The Descent</h4>
            <p className="text-sm text-muted-foreground">
              Begin by pushing your hips back, as if sitting in a chair.
              Bend your knees and lower your body, keeping your weight in your heels.
              Maintain a neutral spine - don't round your back.
            </p>
          </div>
          
          <div className="step">
            <h4 className="font-medium">3. Bottom Position</h4>
            <p className="text-sm text-muted-foreground">
              Lower until your thighs are parallel to the ground (or as low as you can with proper form).
              Keep your knees in line with your toes, not caving inward.
            </p>
          </div>
          
          <div className="step">
            <h4 className="font-medium">4. The Ascent</h4>
            <p className="text-sm text-muted-foreground">
              Push through your heels to stand back up.
              Extend your hips and knees to return to the starting position.
              Maintain tension in your core throughout the movement.
            </p>
          </div>
          
          <div className="common-mistakes mt-6 pt-4 border-t">
            <h4 className="font-medium text-orange-500 dark:text-orange-400">Common Mistakes</h4>
            <ul className="text-sm text-muted-foreground list-disc pl-5 mt-2 space-y-1">
              <li>Letting your knees cave inward</li>
              <li>Rising onto your toes</li>
              <li>Rounding your lower back</li>
              <li>Looking down instead of straight ahead</li>
              <li>Leaning too far forward</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SquatGuide;
