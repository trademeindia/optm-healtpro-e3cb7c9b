
import React from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { SymptomListProps } from './types';

const SymptomList: React.FC<SymptomListProps> = ({ 
  symptoms, 
  getLocationLabel, 
  getPainLevelColor 
}) => {
  return (
    <div className="space-y-3 mb-4 max-h-[350px] overflow-y-auto pr-2">
      {symptoms.length > 0 ? (
        symptoms.map(symptom => (
          <div 
            key={symptom.id} 
            className="p-3 bg-white/50 dark:bg-black/20 rounded-lg border border-border"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{symptom.symptomName}</h4>
                <p className="text-sm text-muted-foreground">{getLocationLabel(symptom.location)}</p>
              </div>
              <div 
                className={cn(
                  "px-2 py-1 rounded text-xs font-medium",
                  getPainLevelColor(symptom.painLevel)
                )}
              >
                Pain: {symptom.painLevel}/10
              </div>
            </div>
            {symptom.notes && (
              <p className="text-sm mt-2 text-muted-foreground">{symptom.notes}</p>
            )}
            <div className="mt-2 flex items-center text-xs text-muted-foreground">
              <Calendar className="w-3 h-3 mr-1" />
              {format(symptom.date, 'MMM d, yyyy')}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-6 text-muted-foreground">
          No symptoms recorded yet. Click "Log New Symptom" to add one.
        </div>
      )}
    </div>
  );
};

export default SymptomList;
