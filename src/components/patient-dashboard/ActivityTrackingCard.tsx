
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ActivityChart } from "@/components/patient-dashboard/ActivityChart";
import { ActivityData } from '@/hooks/patient-dashboard';

interface ActivityTrackingCardProps {
  activityData: ActivityData;
  handleSyncAllData: () => Promise<void>;
  hasConnectedApps: boolean;
}

export const ActivityTrackingCard: React.FC<ActivityTrackingCardProps> = ({
  activityData,
  handleSyncAllData,
  hasConnectedApps
}) => {
  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle>Activity Tracking</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-lg font-semibold">{activityData.currentValue} Steps</p>
            <p className="text-sm text-muted-foreground">
              Source: {activityData.source || 'Unknown'}, Last Sync: {activityData.lastSync || 'N/A'}
            </p>
          </div>
          <Button size="sm" onClick={handleSyncAllData} disabled={!hasConnectedApps}>
            Sync Data
          </Button>
        </div>
        <ActivityChart data={activityData.data} />
      </CardContent>
    </Card>
  );
};
