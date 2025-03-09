
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const WeeklyGoals: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Goals</CardTitle>
        <CardDescription>Your exercise progress this week</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Exercise Sessions</span>
            <span className="text-sm font-medium">2 of 5</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: '40%' }}></div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Minutes Exercised</span>
            <span className="text-sm font-medium">45 of 120</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: '37.5%' }}></div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Different Muscle Groups</span>
            <span className="text-sm font-medium">3 of 6</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: '50%' }}></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyGoals;
