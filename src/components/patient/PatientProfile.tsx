
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Activity, Droplet, Thermometer, Clock, Clipboard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PatientProfileProps {
  patient: {
    id: number;
    name: string;
    age: number;
    gender: string;
    address: string;
    phone: string;
    email: string;
    condition: string;
    icdCode: string;
    lastVisit: string;
    nextVisit: string;
  };
  onAssignTests?: () => void;
}

const PatientProfile: React.FC<PatientProfileProps> = ({ patient, onAssignTests }) => {
  // Mock data for vital signs with status
  const vitalSigns = [
    { 
      label: 'FBS • Elevated', 
      value: '116', 
      unit: 'mg/dL',
      status: 'warning',
      icon: <Droplet className="h-4 w-4 text-orange-500" />
    },
    { 
      label: 'BP • Normal range', 
      value: '120/80', 
      unit: 'mmHg',
      status: 'normal',
      icon: <Activity className="h-4 w-4 text-green-500" />
    },
    { 
      label: 'HR • Stable', 
      value: '72', 
      unit: 'bpm',
      status: 'normal',
      icon: <Heart className="h-4 w-4 text-green-500" />
    },
    { 
      label: 'HbA1c • Good control', 
      value: '5.5', 
      unit: '%',
      status: 'normal',
      icon: <Droplet className="h-4 w-4 text-green-500" />
    }
  ];

  // Mock data for activity scores
  const activityScores = [
    { label: 'Kcal', value: '1,236', unit: '/day' },
    { label: 'Steps', value: '8,152', unit: '/day' },
    { label: 'Sleep', value: '6.4', unit: ' hours/day' }
  ];

  // Mock AI tips
  const aiTips = [
    {
      id: 1,
      text: "Nikolas doesn't sleep much and has gained weight, this could be the reason for elevated blood sugar.",
      action: "Book sleep specialist",
      actionLink: "#"
    },
    {
      id: 2,
      text: "Consider recommending stretching exercises for shoulder pain.",
      action: "Schedule PT",
      actionLink: "#"
    }
  ];

  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="flex items-center p-4 border-b dark:border-gray-700">
        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
          <img 
            src="https://randomuser.me/api/portraits/men/44.jpg" 
            alt={patient.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="ml-4 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <h2 className="text-xl font-bold">{patient.name}, {patient.age} y.o.</h2>
            <Badge variant="outline" className="mt-1 sm:mt-0 w-fit">
              {patient.icdCode} - {patient.condition}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{patient.address}</p>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {vitalSigns.map((vital, index) => (
            <Card key={index} className={`overflow-hidden border ${
              vital.status === 'warning' ? 'border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800' : 
              'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800'
            }`}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">{vital.label}</span>
                  {vital.icon}
                </div>
                <div className="flex items-baseline mt-1">
                  <span className="text-2xl font-bold">{vital.value}</span>
                  <span className="ml-1 text-xs text-muted-foreground">{vital.unit}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button 
          className="w-full mt-4"
          onClick={onAssignTests}
        >
          Assign tests
        </Button>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-sm">Activity score</h3>
            <div className="text-lg font-bold flex items-center">
              69%
              <Badge className="ml-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 hover:bg-yellow-100 dark:hover:bg-yellow-900">
                Medium
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {activityScores.map((score, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  {index === 0 && <Activity className="h-4 w-4 text-blue-500" />}
                  {index === 1 && <Clock className="h-4 w-4 text-blue-500" />}
                  {index === 2 && <Clipboard className="h-4 w-4 text-blue-500" />}
                  <span className="text-xs text-muted-foreground">{score.label}</span>
                </div>
                <div className="mt-1">
                  <span className="font-bold">{score.value}</span>
                  <span className="text-xs text-muted-foreground">{score.unit}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ 
              width: '69%', 
              background: 'linear-gradient(90deg, #4299E1, #F6AD55, #F56565)' 
            }}></div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-medium text-sm mb-3">AI tips</h3>
          <div className="space-y-3">
            {aiTips.map((tip) => (
              <div key={tip.id} className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="flex">
                  <div className="mr-2 mt-0.5">
                    {tip.id === 1 ? 
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 hover:bg-red-100 dark:hover:bg-red-900">
                        !
                      </Badge> :
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 hover:bg-blue-100 dark:hover:bg-blue-900">
                        i
                      </Badge>
                    }
                  </div>
                  <div>
                    <p className="text-sm">{tip.text}</p>
                    <a href={tip.actionLink} className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block">
                      {tip.action}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button variant="outline" className="w-full mt-4">
          All activities
        </Button>
      </div>
    </div>
  );
};

export default PatientProfile;
