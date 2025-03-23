
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AppointmentManager: React.FC = () => {
  return (
    <Card className="shadow-sm border">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Appointment Management</h3>
        <p className="text-muted-foreground mb-6">Schedule and manage your appointments</p>
        <Button>Book New Appointment</Button>
      </CardContent>
    </Card>
  );
};

export default AppointmentManager;
