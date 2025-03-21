
import axios from 'axios';
import { toast } from 'sonner';
import type { SquatState } from '@/components/exercises/posture-monitor/types';

// Define types for OpenSim API responses and requests
export interface OpenSimModelParams {
  height: number; // in cm
  weight: number; // in kg
  age: number;
  gender: 'male' | 'female';
}

export interface OpenSimAnalysisRequest {
  poseKeypoints: any[]; // Keypoints from PoseNet
  modelParams: OpenSimModelParams;
  exerciseType: string; // e.g., "squat", "lunge"
  currentState?: SquatState; // Current state of the exercise
}

export interface OpenSimForceOutput {
  joint: string;
  force: number;
  unit: string;
}

export interface OpenSimJointAngle {
  joint: string;
  angle: number;
  unit: string;
}

export interface OpenSimAnalysisResult {
  joints: OpenSimJointAngle[];
  forces: OpenSimForceOutput[];
  muscleActivations: {
    muscle: string;
    activation: number; // 0-1 scale
  }[];
  formAssessment: {
    issues: string[];
    recommendations: string[];
    overallScore: number; // 0-100 scale
  };
  energyExpenditure: number; // in joules
}

/**
 * Service for interacting with OpenSim API
 * 
 * Note: In a production environment, we would set up proper error handling,
 * authentication, and potentially WebSocket connections for real-time analysis.
 */
class OpenSimService {
  private apiUrl: string;
  private isSimulationMode: boolean;

  constructor() {
    // In a real implementation, this would be an environment variable
    this.apiUrl = import.meta.env.VITE_OPENSIM_API_URL || 'http://localhost:3001/api/opensim';
    
    // If no API URL is provided, use simulation mode
    this.isSimulationMode = !import.meta.env.VITE_OPENSIM_API_URL;
    
    if (this.isSimulationMode) {
      console.log('OpenSim service running in simulation mode. No actual API calls will be made.');
    }
  }

  /**
   * Analyze pose data using OpenSim
   */
  public async analyzePose(data: OpenSimAnalysisRequest): Promise<OpenSimAnalysisResult> {
    try {
      if (this.isSimulationMode) {
        return this.simulateAnalysis(data);
      }
      
      const response = await axios.post<OpenSimAnalysisResult>(
        `${this.apiUrl}/analyze-pose`,
        data
      );
      
      return response.data;
    } catch (error) {
      console.error('Error analyzing pose with OpenSim:', error);
      toast.error('Failed to analyze pose with biomechanical model');
      throw error;
    }
  }
  
  /**
   * Simulate an OpenSim analysis when no actual API is available
   * This is useful for development and testing
   */
  private simulateAnalysis(data: OpenSimAnalysisRequest): OpenSimAnalysisResult {
    console.log('Simulating OpenSim analysis with data:', data);
    
    // Generate realistic-looking simulation data based on exercise state
    const isSquatting = data.currentState === 'bottom_squat';
    const isMidSquat = data.currentState === 'mid_squat';
    
    // Simulate some knee and hip angles based on squat depth
    const kneeAngle = isSquatting ? 120 : (isMidSquat ? 100 : 175);
    const hipAngle = isSquatting ? 95 : (isMidSquat ? 120 : 170);
    
    // Simulate higher muscle activation during squatting
    const quadActivation = isSquatting ? 0.85 : (isMidSquat ? 0.65 : 0.15);
    const gluteActivation = isSquatting ? 0.75 : (isMidSquat ? 0.60 : 0.10);
    
    // Add some variation to make it realistic
    const addVariation = (value: number) => value + (Math.random() * 0.2 - 0.1) * value;
    
    // Simulate some common form issues
    const hasKneeValgus = Math.random() > 0.7;
    const hasExcessiveForwardLean = Math.random() > 0.8 && isSquatting;
    
    // Build form assessment
    const issues: string[] = [];
    if (hasKneeValgus) {
      issues.push('Knee valgus (knees caving inward) detected');
    }
    if (hasExcessiveForwardLean) {
      issues.push('Excessive forward lean detected');
    }
    
    // Create recommendations based on issues
    const recommendations: string[] = [];
    if (hasKneeValgus) {
      recommendations.push('Focus on pushing knees outward during descent');
    }
    if (hasExcessiveForwardLean) {
      recommendations.push('Maintain more upright torso position');
    }
    
    // Calculate overall score (lower if issues present)
    let overallScore = 85;
    overallScore -= (issues.length * 15);
    
    // Add random variation
    overallScore = Math.min(100, Math.max(50, overallScore + (Math.random() * 10 - 5)));
    
    return {
      joints: [
        { joint: 'knee', angle: addVariation(kneeAngle), unit: 'degrees' },
        { joint: 'hip', angle: addVariation(hipAngle), unit: 'degrees' },
        { joint: 'ankle', angle: addVariation(isSquatting ? 80 : 90), unit: 'degrees' }
      ],
      forces: [
        { joint: 'knee', force: addVariation(isSquatting ? 120 : 40), unit: 'N' },
        { joint: 'hip', force: addVariation(isSquatting ? 180 : 60), unit: 'N' },
        { joint: 'ankle', force: addVariation(isSquatting ? 100 : 50), unit: 'N' }
      ],
      muscleActivations: [
        { muscle: 'quadriceps', activation: addVariation(quadActivation) },
        { muscle: 'gluteus_maximus', activation: addVariation(gluteActivation) },
        { muscle: 'hamstrings', activation: addVariation(isSquatting ? 0.45 : 0.2) },
        { muscle: 'gastrocnemius', activation: addVariation(isSquatting ? 0.4 : 0.15) }
      ],
      formAssessment: {
        issues,
        recommendations,
        overallScore: Math.round(overallScore)
      },
      energyExpenditure: addVariation(isSquatting ? 12 : (isMidSquat ? 8 : 3))
    };
  }
}

export const openSimService = new OpenSimService();
