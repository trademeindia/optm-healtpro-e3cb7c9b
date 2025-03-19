
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface BiologicalAgeProps {
  biologicalAge: number;
  chronologicalAge: number;
}

const BiologicalAge: React.FC<BiologicalAgeProps> = ({ 
  biologicalAge, 
  chronologicalAge 
}) => {
  // Calculate age difference
  const ageDifference = chronologicalAge - biologicalAge;
  const percentage = (biologicalAge / chronologicalAge) * 100;
  
  return (
    <Card className="border border-border shadow-sm bg-white dark:bg-gray-800">
      <CardContent className="p-5">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-28 h-28">
            <CircularProgressbar
              value={percentage > 100 ? 100 : percentage}
              text={`${biologicalAge}`}
              styles={buildStyles({
                textSize: '28px',
                pathColor: ageDifference >= 0 ? '#10b981' : '#ef4444',
                textColor: ageDifference >= 0 ? '#10b981' : '#ef4444',
                trailColor: '#e2e8f0',
              })}
            />
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="font-bold text-lg">Biological Age</h3>
            <p className="text-muted-foreground text-sm mb-2">
              Your body is functioning like someone who is {biologicalAge} years old
            </p>
            
            <div className="flex items-center justify-center md:justify-start gap-1 text-sm">
              <span>Chronological Age:</span>
              <span className="font-bold">{chronologicalAge}</span>
              <span className="mx-1">|</span>
              <span>Difference:</span>
              <span className={`font-bold ${ageDifference >= 0 ? 'text-medical-green' : 'text-medical-red'}`}>
                {ageDifference >= 0 ? `${ageDifference} years younger` : `${Math.abs(ageDifference)} years older`}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BiologicalAge;
