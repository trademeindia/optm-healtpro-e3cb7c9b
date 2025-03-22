
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';

interface BiomechanicalAnalysisProps {
  analysisResult: any | null;
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
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Biomechanical Analysis</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-muted-foreground">Processing movement data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Biomechanical Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysisResult) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Biomechanical Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No biomechanical data available yet. Complete a rep to see analysis.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Biomechanical Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {analysisResult.jointLoads && (
          <div>
            <h3 className="text-sm font-medium mb-2">Joint Loads</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-muted p-2 rounded-md">
                <p className="text-xs text-muted-foreground">Knees:</p>
                <p className="font-medium">{analysisResult.jointLoads.knees} N</p>
              </div>
              <div className="bg-muted p-2 rounded-md">
                <p className="text-xs text-muted-foreground">Lower Back:</p>
                <p className="font-medium">{analysisResult.jointLoads.lowerBack} N</p>
              </div>
            </div>
          </div>
        )}

        {analysisResult.muscleActivation && (
          <div>
            <h3 className="text-sm font-medium mb-2">Muscle Activation</h3>
            <div className="space-y-2">
              {Object.entries(analysisResult.muscleActivation).map(([muscle, activation]: [string, any]) => (
                <div key={muscle} className="flex items-center">
                  <span className="text-xs w-24">{muscle}:</span>
                  <div className="flex-1 h-2 bg-muted rounded-full">
                    <div 
                      className="h-2 bg-primary rounded-full" 
                      style={{ width: `${Math.round(Number(activation) * 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-xs ml-2 w-8">{Math.round(Number(activation) * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {analysisResult.feedback && (
          <div>
            <h3 className="text-sm font-medium mb-2">Biomechanical Insights</h3>
            <p className="text-sm">{analysisResult.feedback}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BiomechanicalAnalysis;
