
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Droplets, Activity, Moon } from 'lucide-react';
import HealthMetric from './HealthMetric';

interface PatientProfileCardProps {
  patient: {
    id: number;
    name: string;
    age: number;
    address: string;
    gender: string;
    condition: string;
  };
}

const PatientProfileCard: React.FC<PatientProfileCardProps> = ({ patient }) => {
  return (
    <Card className="glass-morphism w-full">
      <CardContent className="p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="relative h-14 w-14 rounded-full bg-gray-200 overflow-hidden border-2 border-white">
            <img 
              src="/lovable-uploads/d8ce4f15-191e-437b-b151-f8679789a1f4.png" 
              alt={patient.name}
              className="object-cover h-full w-full"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold">
              {patient.name}, {patient.age} y.o.
            </h2>
            <p className="text-sm text-muted-foreground">{patient.address}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <HealthMetric
            title="FBS • Elevated"
            value={116}
            unit="mg/dL"
            icon={<Droplets className="h-3.5 w-3.5" />}
            color="bg-medical-red/10 text-medical-red"
          />
          <HealthMetric
            title="BP • Normal range"
            value="120/80"
            unit="mmHg"
            icon={<Activity className="h-3.5 w-3.5" />}
            color="bg-blue-500/10 text-blue-500"
          />
          <HealthMetric
            title="HR • Stable"
            value={72}
            unit="bpm"
            icon={<Heart className="h-3.5 w-3.5" />}
            color="bg-green-500/10 text-green-500"
          />
          <HealthMetric
            title="HbA1c • Good control"
            value={5.5}
            unit="%"
            icon={<Droplets className="h-3.5 w-3.5" />}
            color="bg-green-500/10 text-green-500"
          />
        </div>

        <Button className="w-full mb-6" size="lg">
          Assign tests
        </Button>

        <div className="mb-4">
          <h3 className="text-sm font-medium mb-3">Activity score</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Activity className="h-4 w-4 text-blue-500" />
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Kcal</span>
                  <span className="text-xs font-medium">1,236/day</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Moon className="h-4 w-4 text-blue-500" />
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Sleep</span>
                  <span className="text-xs font-medium">6.4 hours/day</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Activity className="h-4 w-4 text-blue-500" />
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Steps</span>
                  <span className="text-xs font-medium">8,152/day</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center">
            <div className="relative w-20 h-20">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#eee"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  strokeDasharray="69, 100"
                />
                <defs>
                  <linearGradient id="gradient">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#16a34a" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-xl font-bold">69%</span>
                <span className="text-xs text-muted-foreground">Medium</span>
              </div>
            </div>
          </div>
          <div className="ml-4 flex-1 text-sm">
            <p className="text-muted-foreground mb-2">
              AI tips <span className="text-xs float-right">1/3</span>
            </p>
            <div className="flex gap-2 items-start mb-2">
              <div className="p-1 rounded bg-red-100 text-red-500">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 12H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xs">Nikolas doesn't sleep much and has gained weight, this could be the reason for his elevated FBS.</p>
                <Button variant="link" className="text-xs text-blue-500 h-auto p-0 mt-1">Book sleep specialist</Button>
              </div>
            </div>
          </div>
        </div>

        <Button variant="secondary" className="w-full mt-4" size="sm">
          All activities
        </Button>
      </CardContent>
    </Card>
  );
};

export default PatientProfileCard;
