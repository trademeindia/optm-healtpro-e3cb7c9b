
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SymptomHistoryTable from '../SymptomHistoryTable';
import { BodyRegion, PainSymptom } from '../types';

interface SymptomHistoryCardProps {
  symptoms: PainSymptom[];
  bodyRegions: BodyRegion[];
  onUpdateSymptom: (symptom: PainSymptom) => void;
  onDeleteSymptom: (symptomId: string) => void;
  onToggleActive: (symptomId: string, isActive: boolean) => void;
  loading: boolean;
}

const SymptomHistoryCard: React.FC<SymptomHistoryCardProps> = ({
  symptoms,
  bodyRegions,
  onUpdateSymptom,
  onDeleteSymptom,
  onToggleActive,
  loading
}) => {
  return (
    <Card className="w-full shadow-md mt-4">
      <CardHeader>
        <CardTitle className="text-lg">Symptom History</CardTitle>
      </CardHeader>
      <CardContent>
        <SymptomHistoryTable 
          symptoms={symptoms} 
          bodyRegions={bodyRegions}
          onUpdateSymptom={onUpdateSymptom}
          onDeleteSymptom={onDeleteSymptom}
          onToggleActive={onToggleActive}
          loading={loading}
        />
      </CardContent>
    </Card>
  );
};

export default SymptomHistoryCard;
