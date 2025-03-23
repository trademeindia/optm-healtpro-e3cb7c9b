
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SymptomTracker: React.FC = () => {
  return (
    <Card className="shadow-sm border">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Symptom Tracker</h3>
        <p className="text-muted-foreground mb-6">Track and manage your symptoms over time</p>
        <Button>Record New Symptom</Button>
      </CardContent>
    </Card>
  );
};

export default SymptomTracker;
