
import React from 'react';

interface KeyFindingsProps {
  findings: string[];
}

const KeyFindings: React.FC<KeyFindingsProps> = ({ findings }) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Key Findings</h3>
      <ul className="list-disc pl-5 space-y-1">
        {findings.map((finding, index) => (
          <li key={index} className="text-muted-foreground">{finding}</li>
        ))}
      </ul>
    </div>
  );
};

export default KeyFindings;
