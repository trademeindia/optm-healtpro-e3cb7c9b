
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, PieChart, Pill, Activity } from 'lucide-react';

const DashboardOverview: React.FC = () => {
  return (
    <>
      <Card className="shadow-sm border bg-card">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-3 md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Health Summary</h3>
              <p className="text-muted-foreground mb-6">
                Your health data is displayed here. Connect your health devices 
                to see more detailed information.
              </p>
              <Button>Connect Health App</Button>
            </div>
            <div className="flex items-center justify-center">
              <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center">
                <Activity className="h-12 w-12 text-primary" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-sm border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <p className="text-muted-foreground">You have no upcoming appointments</p>
              <Button variant="outline" size="sm" className="mt-4">Schedule Now</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Recent Symptoms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <p className="text-muted-foreground">No recent symptoms reported</p>
              <Button variant="outline" size="sm" className="mt-4">Record Symptoms</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Pill className="h-4 w-4" />
              Treatment Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <p className="text-muted-foreground">No active treatment plans</p>
              <Button variant="outline" size="sm" className="mt-4">View Recommendations</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default DashboardOverview;
