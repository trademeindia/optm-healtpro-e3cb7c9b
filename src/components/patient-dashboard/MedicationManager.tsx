
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const MedicationManager: React.FC = () => {
  return (
    <Card className="shadow-sm border">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Medication Management</h3>
        <p className="text-muted-foreground mb-6">Track your medications and set reminders</p>
        <Button>Add Medication</Button>
      </CardContent>
    </Card>
  );
};

export default MedicationManager;
