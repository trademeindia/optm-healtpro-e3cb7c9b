
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSymptomSync } from '@/contexts/SymptomSyncContext';
import { getBodyRegions } from '@/components/anatomy-map/data/bodyRegions';
import { formatDistanceToNow } from 'date-fns';

const RecentAnatomyActivity: React.FC = () => {
  const { recentlyViewedRegions, recentlyUpdatedSymptoms } = useSymptomSync();
  const bodyRegions = getBodyRegions();
  
  // Find body region names for the symptoms
  const getRegionNameById = (id: string) => {
    const region = bodyRegions.find(r => r.id === id);
    return region ? region.name : 'Unknown Region';
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Recent Anatomy Map Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentlyUpdatedSymptoms.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Recently Updated Symptoms</h3>
            <ul className="space-y-2">
              {recentlyUpdatedSymptoms.map(symptom => (
                <li key={symptom.id} className="text-sm border-l-2 border-primary pl-3 py-1">
                  <p className="font-medium">{getRegionNameById(symptom.bodyRegionId)}</p>
                  <p className="text-xs text-muted-foreground">
                    {symptom.severity} {symptom.painType} pain
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Updated {formatDistanceToNow(new Date(symptom.updatedAt))} ago
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {recentlyViewedRegions.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Recently Viewed Regions</h3>
            <ul className="space-y-2">
              {recentlyViewedRegions.map(region => (
                <li key={region.id} className="text-sm border-l-2 border-blue-400 pl-3 py-1">
                  <p className="font-medium">{region.name}</p>
                  {region.description && (
                    <p className="text-xs text-muted-foreground">{region.description}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {recentlyViewedRegions.length === 0 && recentlyUpdatedSymptoms.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <p>No recent activity</p>
            <p className="text-xs mt-1">Visit the Anatomy Map to track your symptoms</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentAnatomyActivity;
