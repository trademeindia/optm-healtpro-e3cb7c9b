
import React from 'react';
import { ListChecks } from 'lucide-react';
import { Biomarker } from '../types';

interface RecommendationsProps {
  biomarker: Biomarker;
}

const Recommendations: React.FC<RecommendationsProps> = ({ biomarker }) => {
  const getRecommendations = () => {
    if (biomarker.recommendations && biomarker.recommendations.length > 0) {
      return biomarker.recommendations;
    }
    
    if (biomarker.status === 'normal') {
      return ['Continue with current lifestyle and diet.'];
    } else if (biomarker.status === 'elevated') {
      return [
        'Consider discussing with your healthcare provider',
        'Review your diet and lifestyle factors',
        'Schedule a follow-up test in 3-6 months'
      ];
    } else if (biomarker.status === 'low') {
      return [
        'Consult with your healthcare provider',
        'You may need dietary supplements',
        'Consider follow-up testing within 2-3 months'
      ];
    } else {
      return ['Contact your healthcare provider immediately for guidance.'];
    }
  };

  const recommendations = getRecommendations();

  return (
    <div className="bg-muted/50 p-4 rounded-lg">
      <h4 className="font-medium mb-2 flex items-center">
        <ListChecks className="w-4 h-4 mr-2" />
        Recommendations
      </h4>
      <ul className="list-disc pl-5 space-y-1">
        {recommendations.map((rec, index) => (
          <li key={index} className="text-sm text-muted-foreground">{rec}</li>
        ))}
      </ul>
    </div>
  );
};

export default Recommendations;
