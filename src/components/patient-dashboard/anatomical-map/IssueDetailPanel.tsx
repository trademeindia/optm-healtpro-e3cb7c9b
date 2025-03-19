
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { HealthIssue } from './types';
import { getSeverityColor } from './utils';

interface IssueDetailPanelProps {
  issue: HealthIssue;
}

const IssueDetailPanel: React.FC<IssueDetailPanelProps> = ({ issue }) => {
  return (
    <div className="absolute bottom-3 left-3 right-3 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium">{issue.name}</h3>
          {issue.muscleGroup && (
            <p className="text-xs text-muted-foreground">Muscle Group: {issue.muscleGroup}</p>
          )}
        </div>
        <Badge className={`${getSeverityColor(issue.severity)} text-white`}>
          {issue.severity.toUpperCase()}
        </Badge>
      </div>
      
      <p className="text-sm text-muted-foreground mt-1 mb-2">{issue.description}</p>
      
      {issue.symptoms && issue.symptoms.length > 0 && (
        <div className="mt-2">
          <h4 className="text-xs font-semibold mb-1">Common Symptoms:</h4>
          <ul className="text-xs text-muted-foreground list-disc pl-4">
            {issue.symptoms.map((symptom, index) => (
              <li key={index}>{symptom}</li>
            ))}
          </ul>
        </div>
      )}
      
      {issue.recommendedActions && issue.recommendedActions.length > 0 && (
        <div className="mt-2">
          <h4 className="text-xs font-semibold mb-1">Recommended Actions:</h4>
          <ul className="text-xs text-muted-foreground list-disc pl-4">
            {issue.recommendedActions.map((action, index) => (
              <li key={index}>{action}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default IssueDetailPanel;
