
import React from 'react';
import TrendIndicator from '../TrendIndicator';
import { Biomarker } from '../types';
import { getStatusColor, formatDate } from '../biomarkerUtils';

interface BiomarkerBasicInfoProps {
  biomarker: Biomarker;
}

const BiomarkerBasicInfo: React.FC<BiomarkerBasicInfoProps> = ({ biomarker }) => {
  return (
    <div className="bg-muted/50 p-6 rounded-lg">
      <div className="grid gap-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Current Value</span>
          <span className="text-xl font-bold">
            {biomarker.value} <span className="text-sm font-normal">{biomarker.unit}</span>
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Normal Range</span>
          <span className="text-muted-foreground">{biomarker.normalRange} {biomarker.unit}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Status</span>
          <span className={`${getStatusColor(biomarker.status)} font-medium`}>
            {biomarker.status.charAt(0).toUpperCase() + biomarker.status.slice(1)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Last Updated</span>
          <span className="text-muted-foreground">{formatDate(biomarker.timestamp)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Trend</span>
          <span className="flex items-center gap-2">
            <TrendIndicator trend={biomarker.trend} status={biomarker.status} />
            {biomarker.trend === 'stable' ? 'Stable' : biomarker.trend === 'up' ? 'Increasing' : 'Decreasing'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BiomarkerBasicInfo;
