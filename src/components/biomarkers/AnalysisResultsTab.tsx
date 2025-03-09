
import React from 'react';
import { Info } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { ReportAnalysis } from './types';
import { getStatusColor } from './utils/reportProcessing';

interface AnalysisResultsTabProps {
  analysis: ReportAnalysis | null;
}

const AnalysisResultsTab: React.FC<AnalysisResultsTabProps> = ({ analysis }) => {
  if (!analysis) return null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Summary</h3>
        <p className="text-muted-foreground">{analysis.summary}</p>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Key Findings</h3>
        <ul className="list-disc pl-5 space-y-1">
          {analysis.keyFindings.map((finding, index) => (
            <li key={index} className="text-muted-foreground">{finding}</li>
          ))}
        </ul>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Your Values</h3>
        <div className="space-y-2">
          {Object.entries(analysis.normalValues).map(([key, data]) => (
            <div key={key} className="flex justify-between items-center p-2 border-b">
              <span className="font-medium">{key}</span>
              <span className={getStatusColor(data.status)}>
                {data.value}
                {data.status !== 'normal' && (
                  <Info className="inline ml-1 h-4 w-4" />
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Recommendations</h3>
        <ul className="list-disc pl-5 space-y-1">
          {analysis.recommendations.map((rec, index) => (
            <li key={index} className="text-muted-foreground">{rec}</li>
          ))}
        </ul>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Questions for your doctor</h3>
        <Textarea 
          placeholder="Write any questions you want to ask your doctor about this report..."
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
};

export default AnalysisResultsTab;
