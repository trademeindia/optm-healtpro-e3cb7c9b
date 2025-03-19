
import { useState } from 'react';
import { HealthIssue, MuscleFlexion } from '../types';

export const useAnatomicalMap = () => {
  const [zoom, setZoom] = useState(1);
  const [selectedIssue, setSelectedIssue] = useState<HealthIssue | null>(null);
  
  const healthIssues: HealthIssue[] = [
    {
      id: '1',
      name: 'Rotator Cuff Tear',
      location: { x: 31, y: 19 }, // Updated for better accuracy
      severity: 'medium',
      description: 'Partial tear in the right rotator cuff showing inflammation and reduced strength.',
      muscleGroup: 'Shoulder Muscles',
      symptoms: [
        'Pain when lifting arm',
        'Weakness in the shoulder',
        'Difficulty reaching behind back'
      ],
      recommendedActions: [
        'Physical therapy exercises',
        'Rest and ice',
        'Anti-inflammatory medication'
      ]
    },
    {
      id: '2',
      name: 'Lower Back Strain',
      location: { x: 49, y: 45 }, // Updated for better accuracy
      severity: 'high',
      description: 'Muscle strain in the erector spinae muscles, causing restricted movement and acute pain.',
      muscleGroup: 'Erector Spinae',
      symptoms: [
        'Acute lower back pain',
        'Muscle spasms',
        'Limited mobility'
      ],
      recommendedActions: [
        'Rest with proper support',
        'Heat therapy',
        'Gentle stretching exercises'
      ]
    },
    {
      id: '3',
      name: 'Quadriceps Tendinitis',
      location: { x: 45, y: 70 }, // Updated for better accuracy
      severity: 'low',
      description: 'Mild inflammation of the quadriceps tendon with some discomfort during extension.',
      muscleGroup: 'Quadriceps',
      symptoms: [
        'Pain above the kneecap',
        'Discomfort when straightening leg',
        'Tenderness when pressing on tendon'
      ],
      recommendedActions: [
        'Rest from high-impact activities',
        'Ice therapy',
        'Strengthening exercises'
      ]
    },
    {
      id: '4',
      name: 'Biceps Tendonitis',
      location: { x: 23, y: 30 }, // Updated for better accuracy
      severity: 'medium',
      description: 'Inflammation in the long head of the biceps tendon causing pain during flexion.',
      muscleGroup: 'Biceps Brachii',
      symptoms: [
        'Pain in the front of the shoulder',
        'Tenderness when touching the biceps tendon',
        'Pain when lifting or pulling'
      ],
      recommendedActions: [
        'Rest from activities that aggravate pain',
        'Ice therapy',
        'Gentle stretching'
      ]
    },
    {
      id: '5',
      name: 'Hamstring Strain',
      location: { x: 50, y: 60 }, // New hotspot
      severity: 'medium',
      description: 'Partial tear in the hamstring muscle fibers causing pain in the back of the thigh.',
      muscleGroup: 'Hamstrings',
      symptoms: [
        'Sudden pain during activity',
        'Muscle weakness',
        'Bruising and swelling'
      ],
      recommendedActions: [
        'RICE protocol (Rest, Ice, Compression, Elevation)',
        'Gentle stretching when pain subsides',
        'Gradual return to activity'
      ]
    }
  ];
  
  const muscleFlexionData: MuscleFlexion[] = [
    {
      muscle: 'Rotator Cuff',
      flexionPercentage: 45,
      status: 'weak',
      lastReading: '2 hours ago',
      relatedIssues: ['1']
    },
    {
      muscle: 'Erector Spinae',
      flexionPercentage: 30,
      status: 'overworked',
      lastReading: '2 hours ago',
      relatedIssues: ['2']
    },
    {
      muscle: 'Quadriceps',
      flexionPercentage: 65,
      status: 'weak',
      lastReading: '2 hours ago',
      relatedIssues: ['3']
    },
    {
      muscle: 'Biceps',
      flexionPercentage: 72,
      status: 'healthy',
      lastReading: '2 hours ago',
      relatedIssues: ['4']
    },
    {
      muscle: 'Hamstrings',
      flexionPercentage: 55,
      status: 'weak',
      lastReading: '2 hours ago',
      relatedIssues: ['5']
    }
  ];
  
  const handleZoomIn = () => {
    if (zoom < 1.5) setZoom(zoom + 0.1);
  };
  
  const handleZoomOut = () => {
    if (zoom > 0.7) setZoom(zoom - 0.1);
  };
  
  const handleIssueClick = (issue: HealthIssue) => {
    setSelectedIssue(issue === selectedIssue ? null : issue);
  };
  
  return {
    zoom,
    selectedIssue,
    healthIssues,
    muscleFlexionData,
    handleZoomIn,
    handleZoomOut,
    handleIssueClick
  };
};

export default useAnatomicalMap;
