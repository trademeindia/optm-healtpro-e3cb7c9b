
import React from 'react';
import { Loader } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalysisResult {
  kneeForce?: number;
  hipForce?: number;
  ankleForce?: number;
  backLoad?: number;
  impactScore?: number;
  recommendation?: string;
}

interface BiomechanicalAnalysisProps {
  analysisResult: AnalysisResult | null;
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
      <div className="flex flex-col items-center justify-center py-4 space-y-2">
        <Loader className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Analyzing biomechanical forces...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
        <p className="text-sm text-destructive">Analysis error: {error}</p>
      </div>
    );
  }

  if (!analysisResult) {
    return (
      <div className="p-4 bg-muted rounded-md">
        <p className="text-sm text-muted-foreground">Perform a movement to see biomechanical analysis</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Biomechanical Analysis</CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-3">
        {analysisResult.kneeForce !== undefined && (
          <div className="flex justify-between">
            <span>Knee Force:</span>
            <span className={analysisResult.kneeForce > 2 ? "text-amber-500" : "text-green-500"}>
              {analysisResult.kneeForce.toFixed(1)}x body weight
            </span>
          </div>
        )}
        
        {analysisResult.hipForce !== undefined && (
          <div className="flex justify-between">
            <span>Hip Force:</span>
            <span className={analysisResult.hipForce > 3 ? "text-amber-500" : "text-green-500"}>
              {analysisResult.hipForce.toFixed(1)}x body weight
            </span>
          </div>
        )}
        
        {analysisResult.backLoad !== undefined && (
          <div className="flex justify-between">
            <span>Lumbar Load:</span>
            <span className={analysisResult.backLoad > 2.5 ? "text-destructive" : "text-green-500"}>
              {analysisResult.backLoad.toFixed(1)}x body weight
            </span>
          </div>
        )}
        
        {analysisResult.impactScore !== undefined && (
          <div className="flex justify-between">
            <span>Joint Impact Score:</span>
            <span className={getImpactColor(analysisResult.impactScore)}>
              {analysisResult.impactScore.toFixed(1)}/10
            </span>
          </div>
        )}
        
        {analysisResult.recommendation && (
          <div className="mt-2 p-2 bg-primary/5 rounded-md">
            <p className="text-xs">{analysisResult.recommendation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Helper function to determine color based on impact score
const getImpactColor = (score: number): string => {
  if (score < 3) return "text-green-500";
  if (score < 6) return "text-amber-500";
  return "text-destructive";
};

export default BiomechanicalAnalysis;
