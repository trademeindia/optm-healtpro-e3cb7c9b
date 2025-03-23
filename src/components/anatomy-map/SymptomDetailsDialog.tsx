
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BodyRegion, PainSymptom } from './types';
import { format } from 'date-fns';

interface SymptomDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  symptom: PainSymptom;
  region: BodyRegion;
}

const SymptomDetailsDialog: React.FC<SymptomDetailsDialogProps> = ({
  open,
  onClose,
  symptom,
  region
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy h:mm a');
    } catch (e) {
      return dateString;
    }
  };
  
  const getSeverityColor = (severity: 'mild' | 'moderate' | 'severe') => {
    return severity === 'severe' ? 'bg-red-500 text-white' : 
           severity === 'moderate' ? 'bg-orange-500 text-white' : 
           'bg-yellow-500 text-white';
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl">
        <DialogHeader className="border-b pb-3 mb-4 dark:border-gray-700">
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Symptom Details</DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Detailed information about your reported symptom
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-5 py-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{region.name}</h3>
            <Badge className={`px-3 py-1 ${getSeverityColor(symptom.severity)}`}>
              {symptom.severity.charAt(0).toUpperCase() + symptom.severity.slice(1)} Severity
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Pain Type</p>
              <p className="text-gray-900 dark:text-white">{symptom.painType}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Status</p>
              <Badge variant={symptom.isActive ? "default" : "outline"} className={symptom.isActive ? "bg-green-500 text-white" : ""}>
                {symptom.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Description</p>
            <p className="text-gray-900 dark:text-white">{symptom.description}</p>
          </div>
          
          {symptom.triggers && symptom.triggers.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Triggers</p>
              <div className="flex flex-wrap gap-2">
                {symptom.triggers.map((trigger, index) => (
                  <Badge key={index} variant="outline" className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600">
                    {trigger}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 border-t pt-4 dark:border-gray-700 text-sm">
            <div>
              <p className="font-medium text-gray-500 dark:text-gray-400 mb-1">First Reported</p>
              <p className="text-gray-900 dark:text-white">{formatDate(symptom.createdAt)}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500 dark:text-gray-400 mb-1">Last Updated</p>
              <p className="text-gray-900 dark:text-white">{formatDate(symptom.updatedAt)}</p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="mt-4 pt-4 border-t dark:border-gray-700">
          <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SymptomDetailsDialog;
