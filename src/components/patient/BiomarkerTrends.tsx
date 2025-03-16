
import React from 'react';
import { Biomarker } from '@/types/medicalData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

interface BiomarkerTrendsProps {
  biomarkers: Biomarker[];
}

const BiomarkerTrends: React.FC<BiomarkerTrendsProps> = ({ biomarkers }) => {
  if (biomarkers.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          No biomarker data available
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {biomarkers.map((biomarker) => (
        <Card key={biomarker.id} className="overflow-hidden">
          <CardHeader className="bg-background p-4">
            <CardTitle className="text-md font-medium">{biomarker.name}</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {biomarker.latestValue.value} {biomarker.latestValue.unit}
                </div>
                <div className="text-sm text-muted-foreground">
                  Normal range: {biomarker.latestValue.normalRange}
                </div>
              </div>
              <div className="text-sm">
                <span 
                  className={
                    biomarker.latestValue.status === 'normal' 
                      ? 'text-green-500' 
                      : biomarker.latestValue.status === 'elevated' 
                        ? 'text-amber-500' 
                        : biomarker.latestValue.status === 'critical'
                          ? 'text-red-500'
                          : 'text-blue-500'
                  }
                >
                  {biomarker.latestValue.status.charAt(0).toUpperCase() + biomarker.latestValue.status.slice(1)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BiomarkerTrends;
