
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
      <Card className="border-red-300 bg-red-50 dark:bg-red-950 dark:border-red-800 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium text-red-800 dark:text-red-300">Biomechanical Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-800 dark:text-red-300">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md">
      <CardHeader className="pb-2 border-b">
        <CardTitle className="text-base font-medium flex items-center justify-between">
          <span>Biomechanical Analysis</span>
          {analysisResult && (
            <span className="text-sm font-normal">
              Score: {analysisResult.formAssessment.overallScore}/100
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {isAnalyzing ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : analysisResult ? (
          <>
            {/* Form Assessment */}
            <div className="space-y-2 bg-gray-100 dark:bg-gray-900 p-3 rounded-md">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Form Assessment</h3>
              {analysisResult.formAssessment.issues.length > 0 ? (
                <ul className="text-xs space-y-1 list-disc list-inside">
                  {analysisResult.formAssessment.issues.map((issue, i) => (
                    <li key={i} className="text-amber-700 dark:text-amber-400">{issue}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-green-700 dark:text-green-400">Great form! No issues detected.</p>
              )}
              
              {analysisResult.formAssessment.recommendations.length > 0 && (
                <div className="mt-2">
                  <h4 className="text-xs font-medium text-gray-800 dark:text-gray-200">Recommendations:</h4>
                  <ul className="text-xs space-y-1 list-disc list-inside">
                    {analysisResult.formAssessment.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Muscle Activations */}
            <div className="space-y-2 bg-gray-100 dark:bg-gray-900 p-3 rounded-md">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Muscle Activation</h3>
              <div className="space-y-2">
                {analysisResult.muscleActivations.map((muscle) => (
                  <div key={muscle.muscle} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-700 dark:text-gray-300">{muscle.muscle.replace('_', ' ')}</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">{Math.round(muscle.activation * 100)}%</span>
                    </div>
                    <Progress value={muscle.activation * 100} className="h-1" />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Joint Forces and Angles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 bg-gray-100 dark:bg-gray-900 p-3 rounded-md">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Joint Angles</h3>
                <div className="space-y-1">
                  {analysisResult.joints.map((joint) => (
                    <div key={joint.joint} className="text-xs flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">{joint.joint}</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">{Math.round(joint.angle)}°</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2 bg-gray-100 dark:bg-gray-900 p-3 rounded-md">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Joint Forces</h3>
                <div className="space-y-1">
                  {analysisResult.forces.map((force) => (
                    <div key={force.joint} className="text-xs flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">{force.joint}</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">{Math.round(force.force)} {force.unit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Energy Expenditure */}
            <div className="text-xs bg-gray-100 dark:bg-gray-900 p-3 rounded-md">
              <span className="font-medium text-gray-800 dark:text-gray-200">Energy Expenditure: </span>
              <span className="text-gray-700 dark:text-gray-300">{analysisResult.energyExpenditure.toFixed(1)} J</span>
            </div>
          </>
        ) : (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Complete a squat to see biomechanical analysis results.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default BiomechanicalAnalysis;
