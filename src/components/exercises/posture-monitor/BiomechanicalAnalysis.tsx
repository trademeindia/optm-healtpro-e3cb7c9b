
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader } from 'lucide-react';
import { OpenSimAnalysisResult } from '@/services/opensim/opensimService';

interface BiomechanicalAnalysisProps {
  analysisResult: OpenSimAnalysisResult | null;
  isAnalyzing: boolean;
  error: string | null;
}

const BiomechanicalAnalysis: React.FC<BiomechanicalAnalysisProps> = ({
  analysisResult,
  isAnalyzing,
  error
}) => {
  if (isAnalyzing) {
    return (
      <Card className="w-full p-4">
        <div className="flex items-center justify-center py-8">
          <Loader className="h-8 w-8 animate-spin text-primary mr-2" />
          <p>Processing biomechanical analysis...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full p-4">
        <CardContent className="p-4">
          <p className="text-destructive">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!analysisResult) {
    return (
      <Card className="w-full p-4">
        <CardContent className="p-4">
          <p className="text-muted-foreground">No biomechanical data available yet. Please perform a movement.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-4">Biomechanical Analysis</h3>
        
        <div className="space-y-4">
          {/* Joint Angles */}
          <div>
            <h4 className="font-medium text-sm mb-2">Joint Angles</h4>
            <div className="grid grid-cols-2 gap-2">
              {analysisResult.joints.map((joint, index) => (
                <div key={index} className="flex justify-between border p-2 rounded">
                  <span>{joint.joint}</span>
                  <span className="font-medium">{Math.round(joint.angle)}°</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Muscle Activations */}
          <div>
            <h4 className="font-medium text-sm mb-2">Muscle Activations</h4>
            <div className="space-y-2">
              {analysisResult.muscleActivations.map((muscle, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{muscle.muscle.replace('_', ' ')}</span>
                    <span>{Math.round(muscle.activation * 100)}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary rounded-full h-2" 
                      style={{ width: `${Math.round(muscle.activation * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Form Assessment */}
          {analysisResult.formAssessment && (
            <div>
              <h4 className="font-medium text-sm mb-2">Form Assessment</h4>
              <div className="border rounded p-3">
                <div className="flex justify-between items-center mb-2">
                  <span>Overall Score</span>
                  <span className={`font-bold ${
                    analysisResult.formAssessment.overallScore > 70 ? 'text-green-500' : 
                    analysisResult.formAssessment.overallScore > 40 ? 'text-amber-500' : 'text-red-500'
                  }`}>
                    {analysisResult.formAssessment.overallScore}/100
                  </span>
                </div>
                
                {analysisResult.formAssessment.issues.length > 0 && (
                  <div className="mt-2">
                    <h5 className="text-xs font-medium mb-1">Issues Detected</h5>
                    <ul className="text-xs list-disc list-inside text-destructive">
                      {analysisResult.formAssessment.issues.map((issue, i) => (
                        <li key={i}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {analysisResult.formAssessment.recommendations.length > 0 && (
                  <div className="mt-2">
                    <h5 className="text-xs font-medium mb-1">Recommendations</h5>
                    <ul className="text-xs list-disc list-inside text-primary">
                      {analysisResult.formAssessment.recommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BiomechanicalAnalysis;
