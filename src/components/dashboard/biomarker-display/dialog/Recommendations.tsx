
import React from 'react';
import { Biomarker } from '../types';

interface RecommendationsProps {
  biomarker: Biomarker;
}

const Recommendations: React.FC<RecommendationsProps> = ({ biomarker }) => {
  return (
    <div className="bg-muted/50 p-4 rounded-lg">
      <h4 className="font-medium mb-2">Recommendations</h4>
      <div className="text-sm">
        {biomarker.recommendations && biomarker.recommendations.length > 0 ? (
          <ul className="list-disc ml-4 space-y-1">
            {biomarker.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        ) : (
          biomarker.status === 'normal' ? (
            <p>Your levels are in the normal range. Continue with current lifestyle and diet.</p>
          ) : biomarker.status === 'elevated' ? (
            <ul className="list-disc ml-4 space-y-1">
              <li>Consider discussing with your healthcare provider</li>
              <li>Review your diet and lifestyle factors</li>
              <li>Schedule a follow-up test in 3-6 months</li>
            </ul>
          ) : biomarker.status === 'low' ? (
            <ul className="list-disc ml-4 space-y-1">
              <li>Consult with your healthcare provider</li>
              <li>You may need dietary supplements</li>
              <li>Consider follow-up testing within 2-3 months</li>
            </ul>
          ) : (
            <p className="text-red-500 font-medium">Contact your healthcare provider immediately for guidance.</p>
          )
        )}
      </div>
    </div>
  );
};

export default Recommendations;
