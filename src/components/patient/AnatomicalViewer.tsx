
import React from 'react';
import { Biomarker, AnatomicalMapping } from '@/types/medicalData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

interface AnatomicalViewerProps {
  mappings: AnatomicalMapping[];
  biomarkers: Biomarker[];
}

const AnatomicalViewer: React.FC<AnatomicalViewerProps> = ({ mappings, biomarkers }) => {
  if (mappings.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          No anatomical mapping data available
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      <Card className="overflow-hidden">
        <CardHeader className="bg-background p-4">
          <CardTitle className="text-md font-medium">Body Map</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground italic mb-4">
            Simplified body map visualization
          </div>
          <div className="relative w-full h-64 bg-muted rounded-md flex items-center justify-center">
            {mappings.map((mapping, index) => (
              <div 
                key={index}
                className="absolute w-4 h-4 rounded-full bg-red-500"
                style={{ 
                  left: `${mapping.coordinates.x}%`, 
                  top: `${mapping.coordinates.y}%`,
                  opacity: mapping.severity / 10
                }}
                title={mapping.notes || mapping.bodyPart}
              />
            ))}
            <div className="text-muted-foreground">Body outline (placeholder)</div>
          </div>
          
          <div className="mt-6 space-y-4">
            <h3 className="font-medium">Affected Areas:</h3>
            <ul className="space-y-2">
              {mappings.map((mapping, index) => (
                <li key={index} className="flex justify-between items-center pb-2 border-b">
                  <div>
                    <span className="font-medium">{mapping.bodyPart.replace('_', ' ')}</span>
                    {mapping.notes && (
                      <p className="text-sm text-muted-foreground">{mapping.notes}</p>
                    )}
                  </div>
                  <div className="text-sm">
                    Severity: <span className="font-medium">{mapping.severity}/10</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnatomicalViewer;
