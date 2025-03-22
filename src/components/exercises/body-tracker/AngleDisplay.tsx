
import React from 'react';
import { Card } from '@/components/ui/card';
import { AngleDisplayProps } from './types';
import { useEffect, useState } from 'react';

// Define threshold values for ideal angles
const angleThresholds: Record<string, { min: number; max: number; }> = {
  'Left Elbow': { min: 20, max: 160 },
  'Right Elbow': { min: 20, max: 160 },
  'Left Knee': { min: 10, max: 170 },
  'Right Knee': { min: 10, max: 170 },
  'Left Hip': { min: 70, max: 180 },
  'Right Hip': { min: 70, max: 180 },
};

const AngleDisplay: React.FC<AngleDisplayProps> = ({ angles }) => {
  const [prevAngles, setPrevAngles] = useState<Record<string, number>>({});
  const [angleChanges, setAngleChanges] = useState<Record<string, 'increasing' | 'decreasing' | 'stable'>>({});

  // Track angle changes
  useEffect(() => {
    const changes: Record<string, 'increasing' | 'decreasing' | 'stable'> = {};
    const currentAnglesMap: Record<string, number> = {};
    
    angles.forEach(angle => {
      currentAnglesMap[angle.joint] = angle.angle;
      
      if (prevAngles[angle.joint]) {
        const diff = angle.angle - prevAngles[angle.joint];
        if (Math.abs(diff) > 2) { // Only show significant changes
          changes[angle.joint] = diff > 0 ? 'increasing' : 'decreasing';
        } else {
          changes[angle.joint] = 'stable';
        }
      } else {
        changes[angle.joint] = 'stable';
      }
    });
    
    setAngleChanges(changes);
    setPrevAngles(currentAnglesMap);
  }, [angles, prevAngles]);

  // Get color class based on angle value
  const getAngleColorClass = (joint: string, value: number): string => {
    const threshold = angleThresholds[joint];
    if (!threshold) return '';
    
    if (value < threshold.min || value > threshold.max) {
      return 'text-red-500 font-bold';
    }
    return 'text-green-500 font-bold';
  };

  // Get arrow icon based on change direction
  const getChangeIndicator = (joint: string) => {
    const direction = angleChanges[joint];
    if (!direction || direction === 'stable') return null;
    
    return direction === 'increasing' ? 
      <span className="text-blue-500">↑</span> : 
      <span className="text-amber-500">↓</span>;
  };

  return (
    <Card className="p-4 bg-card">
      <h3 className="text-base font-medium mb-2">Joint Angles</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {angles.map((angle, index) => (
          <div key={index} className="bg-muted p-2 rounded-md flex justify-between">
            <span className="text-sm">{angle.joint}:</span>
            <span className={`text-sm ${getAngleColorClass(angle.joint, angle.angle)}`}>
              {angle.angle}° {getChangeIndicator(angle.joint)}
            </span>
          </div>
        ))}
        
        {angles.length === 0 && (
          <div className="col-span-3 text-sm text-muted-foreground">
            No joint angles detected. Please make sure your body is visible in the camera.
          </div>
        )}
      </div>
      
      {angles.length > 0 && (
        <div className="mt-3 text-xs text-muted-foreground">
          <p>Green values indicate angles within recommended range.</p>
        </div>
      )}
    </Card>
  );
};

export default AngleDisplay;
