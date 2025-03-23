
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AnatomicalView: React.FC = () => {
  return (
    <Card className="shadow-sm border">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Anatomical View</h3>
        <p className="text-muted-foreground mb-6">Explore your body's health status</p>
        <Button>Open Anatomical Map</Button>
      </CardContent>
    </Card>
  );
};

export default AnatomicalView;
