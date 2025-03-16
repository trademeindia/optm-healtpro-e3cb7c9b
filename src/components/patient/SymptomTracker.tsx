
import React from 'react';
import { Biomarker, SymptomRecord } from '@/types/medicalData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';

interface SymptomTrackerProps {
  symptoms: SymptomRecord[];
  biomarkers: Biomarker[];
}

const SymptomTracker: React.FC<SymptomTrackerProps> = ({ symptoms, biomarkers }) => {
  if (symptoms.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          No symptom data available
        </div>
      </Card>
    );
  }

  // Sort symptoms by date (newest first)
  const sortedSymptoms = [...symptoms].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="grid grid-cols-1 gap-4">
      <Card className="overflow-hidden">
        <CardHeader className="bg-background p-4">
          <CardTitle className="text-md font-medium">Symptom History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {sortedSymptoms.map((symptom) => (
              <div key={symptom.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{symptom.symptomName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(new Date(symptom.timestamp), "MMMM d, yyyy")}
                    </p>
                  </div>
                  <div className="text-sm">
                    <span 
                      className={
                        symptom.severity > 7 ? "text-red-500" :
                        symptom.severity > 4 ? "text-amber-500" :
                        "text-green-500"
                      }
                    >
                      Severity: {symptom.severity}/10
                    </span>
                  </div>
                </div>
                
                {symptom.relatedBiomarkers && symptom.relatedBiomarkers.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground">Related biomarkers:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {symptom.relatedBiomarkers.map(biomarkerId => {
                        const biomarker = biomarkers.find(b => b.id === biomarkerId);
                        return biomarker ? (
                          <span key={biomarkerId} className="text-xs bg-muted px-2 py-1 rounded-full">
                            {biomarker.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SymptomTracker;
