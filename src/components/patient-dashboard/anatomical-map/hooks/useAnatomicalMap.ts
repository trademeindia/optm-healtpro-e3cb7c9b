
import { useState, useEffect, useCallback } from 'react';
import { HealthIssue, MuscleFlexion } from '../types';

// Type for the return value of the hook
interface UseAnatomicalMapReturn {
  healthIssues: HealthIssue[];
  muscleFlexionData: MuscleFlexion[]; // Changed from muscleFlexions to muscleFlexionData
  selectedIssue: HealthIssue | null;
  selectedMuscle: MuscleFlexion | null;
  isLoading: boolean;
  isLoaded: boolean; // Added isLoaded property
  zoom: number;
  setZoom: (zoom: number) => void;
  handleIssueClick: (issue: HealthIssue) => void;
  handleMuscleClick: (muscle: MuscleFlexion) => void;
  handleTabChange: (tab: string) => void;
  activeTab: string;
}

export const useAnatomicalMap = (): UseAnatomicalMapReturn => {
  const [healthIssues, setHealthIssues] = useState<HealthIssue[]>([]);
  const [muscleFlexionData, setMuscleFlexionData] = useState<MuscleFlexion[]>([]); // Renamed to match context
  const [selectedIssue, setSelectedIssue] = useState<HealthIssue | null>(null);
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleFlexion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false); // Added isLoaded state
  const [zoom, setZoom] = useState(1);
  const [activeTab, setActiveTab] = useState('issues');

  // Fetch health issues
  useEffect(() => {
    const fetchHealthIssues = async () => {
      try {
        // Simulating API fetch
        setTimeout(() => {
          setHealthIssues(mockHealthIssues);
          setIsLoading(false);
          setIsLoaded(true); // Set isLoaded to true after data is fetched
        }, 800);
      } catch (error) {
        console.error('Error fetching health issues:', error);
        setIsLoading(false);
      }
    };

    fetchHealthIssues();
  }, []);

  // Fetch muscle flexions
  useEffect(() => {
    const fetchMuscleFlexions = async () => {
      try {
        // Simulating API fetch
        setTimeout(() => {
          setMuscleFlexionData(mockMuscleFlexions); // Renamed to match context
        }, 1000);
      } catch (error) {
        console.error('Error fetching muscle flexions:', error);
      }
    };

    fetchMuscleFlexions();
  }, []);

  const handleIssueClick = useCallback((issue: HealthIssue) => {
    setSelectedIssue(prevIssue => prevIssue?.id === issue.id ? null : issue);
    setSelectedMuscle(null);
    setActiveTab('issues');
  }, []);

  const handleMuscleClick = useCallback((muscle: MuscleFlexion) => {
    setSelectedMuscle(prevMuscle => prevMuscle?.id === muscle.id ? null : muscle);
    setSelectedIssue(null);
    setActiveTab('muscles');
  }, []);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    if (tab === 'issues') {
      setSelectedMuscle(null);
    } else if (tab === 'muscles') {
      setSelectedIssue(null);
    }
  }, []);

  return {
    healthIssues,
    muscleFlexionData, // Renamed to match context
    selectedIssue,
    selectedMuscle,
    isLoading,
    isLoaded, // Added isLoaded property
    zoom,
    setZoom,
    handleIssueClick,
    handleMuscleClick,
    handleTabChange,
    activeTab,
  };
};

// Mock data
const mockHealthIssues: HealthIssue[] = [
  {
    id: '1',
    name: 'Lower Back Pain',
    description: 'Chronic pain in the lumbar region, possibly related to poor posture.',
    severity: 'high',
    location: { x: 48, y: 42 },
    muscleGroup: 'Lumbar',
    symptoms: ['Pain when bending', 'Stiffness in the morning', 'Radiating pain'],
    recommendedActions: ['Core strengthening', 'Posture correction', 'Regular stretching'],
    isActive: true
  },
  {
    id: '2',
    name: 'Shoulder Tension',
    description: 'Tightness and discomfort in the trapezius muscle area.',
    severity: 'medium',
    location: { x: 48, y: 25 },
    muscleGroup: 'Trapezius',
    symptoms: ['Stiffness', 'Limited range of motion', 'Pain when lifting arms'],
    recommendedActions: ['Shoulder stretches', 'Massage therapy', 'Heat application'],
    isActive: true
  },
  {
    id: '3',
    name: 'Knee Inflammation',
    description: 'Swelling and pain in the right knee joint, possibly meniscus related.',
    severity: 'low',
    location: { x: 44, y: 65 },
    muscleGroup: 'Knee joint',
    symptoms: ['Swelling', 'Pain when walking', 'Clicking sound'],
    recommendedActions: ['Rest', 'Ice application', 'Anti-inflammatory medication'],
    isActive: true
  }
];

const mockMuscleFlexions: MuscleFlexion[] = [
  {
    id: 'm1',
    muscleGroup: 'Quadriceps',
    muscle: 'Rectus Femoris',
    flexionPercentage: 65,
    status: 'normal',  // This should match the updated enum
    region: 'Upper Leg',
    relatedIssues: ['3'],
    lastReading: new Date(Date.now() - 24 * 60 * 60 * 1000)
  },
  {
    id: 'm2',
    muscleGroup: 'Lower Back',
    muscle: 'Erector Spinae',
    flexionPercentage: 40,
    status: 'limited',  // This should match the updated enum
    region: 'Back',
    relatedIssues: ['1'],
    lastReading: new Date(Date.now() - 12 * 60 * 60 * 1000)
  },
  {
    id: 'm3',
    muscleGroup: 'Shoulder',
    muscle: 'Trapezius',
    flexionPercentage: 80,
    status: 'excessive',  // This should match the updated enum
    region: 'Upper Back',
    relatedIssues: ['2'],
    lastReading: new Date(Date.now() - 6 * 60 * 60 * 1000)
  },
  {
    id: 'm4',
    muscleGroup: 'Calf',
    muscle: 'Gastrocnemius',
    flexionPercentage: 55,
    status: 'normal',  // This should match the updated enum
    region: 'Lower Leg',
    relatedIssues: [],
    lastReading: new Date(Date.now() - 36 * 60 * 60 * 1000)
  },
  {
    id: 'm5',
    muscleGroup: 'Biceps',
    muscle: 'Biceps Brachii',
    flexionPercentage: 75,
    status: 'normal',  // This should match the updated enum
    region: 'Arm',
    relatedIssues: [],
    lastReading: new Date(Date.now() - 48 * 60 * 60 * 1000)
  }
];

export default useAnatomicalMap;
