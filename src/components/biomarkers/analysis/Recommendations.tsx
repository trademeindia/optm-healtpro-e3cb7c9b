
import React from 'react';

interface RecommendationsProps {
  recommendations: string[];
}

const Recommendations: React.FC<RecommendationsProps> = ({ recommendations }) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Recommendations</h3>
      <ul className="list-disc pl-5 space-y-1">
        {recommendations.map((rec, index) => (
          <li key={index} className="text-muted-foreground">{rec}</li>
        ))}
      </ul>
    </div>
  );
};

export default Recommendations;
