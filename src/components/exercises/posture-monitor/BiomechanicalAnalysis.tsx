
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import type { OpenSimAnalysisResult } from '@/services/opensim/opensimService';

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
  if (error) {
    return (
      <Card className="border-warning/50 bg-warning/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Biomechanical Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-warning">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center justify-between">
          <span>Biomechanical Analysis</span>
          {analysisResult && (
            <span className="text-sm font-normal">
              Score: {analysisResult.formAssessment.overallScore}/100
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAnalyzing ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : analysisResult ? (
          <>
            {/* Form Assessment */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Form Assessment</h3>
              {analysisResult.formAssessment.issues.length > 0 ? (
                <ul className="text-xs space-y-1 list-disc list-inside">
                  {analysisResult.formAssessment.issues.map((issue, i) => (
                    <li key={i} className="text-warning">{issue}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-success">Great form! No issues detected.</p>
              )}
              
              {analysisResult.formAssessment.recommendations.length > 0 && (
                <div className="mt-2">
                  <h4 className="text-xs font-medium">Recommendations:</h4>
                  <ul className="text-xs space-y-1 list-disc list-inside">
                    {analysisResult.formAssessment.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Muscle Activations */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Muscle Activation</h3>
              <div className="space-y-2">
                {analysisResult.muscleActivations.map((muscle) => (
                  <div key={muscle.muscle} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>{muscle.muscle.replace('_', ' ')}</span>
                      <span>{Math.round(muscle.activation * 100)}%</span>
                    </div>
                    <Progress value={muscle.activation * 100} className="h-1" />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Joint Forces and Angles */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Joint Angles</h3>
                <div className="space-y-1">
                  {analysisResult.joints.map((joint) => (
                    <div key={joint.joint} className="text-xs flex justify-between">
                      <span>{joint.joint}</span>
                      <span>{Math.round(joint.angle)}°</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Joint Forces</h3>
                <div className="space-y-1">
                  {analysisResult.forces.map((force) => (
                    <div key={force.joint} className="text-xs flex justify-between">
                      <span>{force.joint}</span>
                      <span>{Math.round(force.force)} {force.unit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Energy Expenditure */}
            <div className="text-xs">
              <span className="font-medium">Energy Expenditure: </span>
              <span>{analysisResult.energyExpenditure.toFixed(1)} J</span>
            </div>
          </>
        ) : (
          <p className="text-xs text-muted-foreground">
            Complete a squat to see biomechanical analysis results.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default BiomechanicalAnalysis;
