import React from 'react';
import { Button } from '@/components/ui/button';
import PatientHeader from './profile/PatientHeader';
import VitalSigns from './profile/VitalSigns';
import ActivityScore from './profile/ActivityScore';
import AiTips from './profile/AiTips';

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
  showFullDetails?: boolean;
}

const PatientProfile: React.FC<PatientProfileProps> = ({ 
  patient, 
  onAssignTests,
  showFullDetails = true 
}) => {
  // Mock data for vital signs with status
  const vitalSigns = [
    { 
      label: 'FBS • Elevated', 
      value: '116', 
      unit: 'mg/dL',
      status: 'warning' as const,
    },
    { 
      label: 'BP • Normal range', 
      value: '120/80', 
      unit: 'mmHg',
      status: 'normal' as const,
    },
    { 
      label: 'HR • Stable', 
      value: '72', 
      unit: 'bpm',
      status: 'normal' as const,
    },
    { 
      label: 'HbA1c • Good control', 
      value: '5.5', 
      unit: '%',
      status: 'normal' as const,
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
      <PatientHeader patient={patient} />

      <div className="p-4">
        <VitalSigns vitalSigns={vitalSigns} />

        {showFullDetails && (
          <Button 
            className="w-full mt-4"
            onClick={onAssignTests}
          >
            Assign tests
          </Button>
        )}

        <div className="mt-6">
          <ActivityScore score={69} activityScores={activityScores} />
        </div>

        {showFullDetails && (
          <div className="mt-6">
            <AiTips tips={aiTips} />
          </div>
        )}

        {showFullDetails && (
          <Button variant="outline" className="w-full mt-4">
            All activities
          </Button>
        )}
      </div>
    </div>
  );
};

export default PatientProfile;
