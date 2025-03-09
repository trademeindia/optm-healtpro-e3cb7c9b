
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const DoctorRecommendations: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Doctor's Recommendations</CardTitle>
        <CardDescription>Exercise notes from your provider</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 border rounded-lg bg-amber-50 dark:bg-yellow-900/20 text-sm">
          <p className="font-medium text-amber-800 dark:text-amber-400 mb-1">Focus Areas</p>
          <p className="text-amber-700 dark:text-amber-300/80">
            Concentrate on lower back exercises and core strengthening. Start with low intensity and gradually increase.
          </p>
        </div>
        
        <div className="p-3 border rounded-lg bg-green-50 dark:bg-green-900/20 text-sm">
          <p className="font-medium text-green-800 dark:text-green-400 mb-1">Frequency</p>
          <p className="text-green-700 dark:text-green-300/80">
            Aim for 3-5 sessions per week, 20-30 minutes each. Take rest days as needed if experiencing pain.
          </p>
        </div>
        
        <div className="p-3 border rounded-lg bg-red-50 dark:bg-red-900/20 text-sm">
          <p className="font-medium text-red-800 dark:text-red-400 mb-1">Avoid</p>
          <p className="text-red-700 dark:text-red-300/80">
            High-impact activities, heavy lifting, and exercises that cause sharp pain in the lower back.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorRecommendations;
