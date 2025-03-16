
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Health Analytics Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Patient Portal</CardTitle>
              <CardDescription>
                View your health data, biomarkers, and appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate('/patient')}
                className="w-full"
              >
                Go to Patient Dashboard
              </Button>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Provider Dashboard</CardTitle>
              <CardDescription>
                Manage patients, appointments, and clinical data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate('/dashboard')}
                className="w-full"
              >
                Go to Provider Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
