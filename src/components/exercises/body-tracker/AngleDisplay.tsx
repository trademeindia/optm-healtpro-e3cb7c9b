
import React from 'react';
import { Card } from '@/components/ui/card';
import { AngleDisplayProps } from './types';

const AngleDisplay: React.FC<AngleDisplayProps> = ({ angles }) => {
  return (
    <Card className="p-4 bg-card">
      <h3 className="text-base font-medium mb-2">Joint Angles</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {angles.map((angle, index) => (
          <div key={index} className="bg-muted p-2 rounded-md flex justify-between">
            <span className="text-sm">{angle.joint}:</span>
            <span className="text-sm font-medium">{angle.angle}°</span>
          </div>
        ))}
        
        {angles.length === 0 && (
          <div className="col-span-3 text-sm text-muted-foreground">
            No joint angles detected. Please make sure your body is visible in the camera.
          </div>
        )}
      </div>
    </Card>
  );
};

export default AngleDisplay;
