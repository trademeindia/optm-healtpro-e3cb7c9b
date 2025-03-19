
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
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{issue.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{issue.description}</p>
        </div>
        <Badge className={`${getSeverityColor(issue.severity)} text-white`}>
          {issue.severity.toUpperCase()}
        </Badge>
      </div>
    </div>
  );
};

export default IssueDetailPanel;
