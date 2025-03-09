
import React from 'react';

interface ReportSummaryProps {
  summary: string;
}

const ReportSummary: React.FC<ReportSummaryProps> = ({ summary }) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Summary</h3>
      <p className="text-muted-foreground">{summary}</p>
    </div>
  );
};

export default ReportSummary;
