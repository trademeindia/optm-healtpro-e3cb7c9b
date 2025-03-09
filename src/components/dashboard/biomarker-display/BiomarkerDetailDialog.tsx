
import React from 'react';
import { Activity } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import TrendIndicator from './TrendIndicator';
import { 
  Biomarker, 
  getStatusColor, 
  getStatusBgColor, 
  getStatusDescription, 
  getTrendDescription,
  formatDate 
} from './biomarkerUtils';

interface BiomarkerDetailDialogProps {
  biomarker: Biomarker | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BiomarkerDetailDialog: React.FC<BiomarkerDetailDialogProps> = ({ 
  biomarker, 
  open, 
  onOpenChange 
}) => {
  if (!biomarker) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {biomarker.name}
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusBgColor(biomarker.status)}`}>
              {biomarker.status.charAt(0).toUpperCase() + biomarker.status.slice(1)}
            </span>
          </DialogTitle>
          <DialogDescription>
            Detailed information about your {biomarker.name} biomarker
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Current Value</span>
              <span className="text-xl font-bold">{biomarker.value} <span className="text-sm font-normal">{biomarker.unit}</span></span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Normal Range</span>
              <span>{biomarker.normalRange} {biomarker.unit}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Status</span>
              <span className={`${getStatusColor(biomarker.status)}`}>
                {biomarker.status.charAt(0).toUpperCase() + biomarker.status.slice(1)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Last Updated</span>
              <span>{formatDate(biomarker.timestamp)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Trend</span>
              <span className="flex items-center">
                <TrendIndicator trend={biomarker.trend} status={biomarker.status} />
                {biomarker.trend === 'stable' ? 'Stable' : biomarker.trend === 'up' ? 'Increasing' : 'Decreasing'}
              </span>
            </div>
          </div>
          
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">What does this mean?</h4>
            <p className="text-sm">{getStatusDescription(biomarker.status, biomarker.name)}</p>
            {biomarker.description && (
              <div className="mt-2">
                <h4 className="font-medium mb-1">About this biomarker</h4>
                <p className="text-sm">{biomarker.description}</p>
              </div>
            )}
            <div className="mt-2">
              <h4 className="font-medium mb-1">Trend analysis</h4>
              <p className="text-sm">{getTrendDescription(biomarker.trend, biomarker.status)}</p>
            </div>
          </div>

          {biomarker.possibleCauses && biomarker.possibleCauses.length > 0 && (
            <div className="bg-muted/70 p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center">
                <Activity className="w-4 h-4 mr-2" />
                Possible Causes
              </h4>
              <ul className="list-disc ml-4 space-y-1 text-sm">
                {biomarker.possibleCauses.map((cause, index) => (
                  <li key={index}>{cause}</li>
                ))}
              </ul>
            </div>
          )}

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
          
          <Separator />
          
          <div className="text-xs text-muted-foreground">
            <p className="font-medium mb-1">Important Note:</p>
            <p>This information is for educational purposes only and should not replace professional medical advice. Always consult with your healthcare provider about your test results and before making any changes to your health routine.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BiomarkerDetailDialog;
