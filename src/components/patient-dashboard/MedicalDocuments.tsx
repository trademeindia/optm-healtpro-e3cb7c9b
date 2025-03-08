
import React from 'react';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MedicalDocumentsProps {
  className?: string;
}

const MedicalDocuments: React.FC<MedicalDocumentsProps> = ({ className }) => {
  return (
    <div className={`glass-morphism rounded-2xl p-4 md:p-6 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Medical Documents</h3>
        <Button variant="ghost" size="sm" className="text-primary text-xs md:text-sm">
          View All
        </Button>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-2 md:p-3 border rounded-lg bg-card hover:bg-secondary/40 transition-colors duration-200">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="bg-primary/10 p-1.5 md:p-2 rounded-full">
              <FileText className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
            </div>
            <div>
              <h4 className="text-xs md:text-sm font-medium">MRI Results</h4>
              <p className="text-xs text-muted-foreground">May 28, 2023</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-7 w-7 md:h-8 md:w-8 p-0" title="Download">
            <Download className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between p-2 md:p-3 border rounded-lg bg-card hover:bg-secondary/40 transition-colors duration-200">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="bg-primary/10 p-1.5 md:p-2 rounded-full">
              <FileText className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
            </div>
            <div>
              <h4 className="text-xs md:text-sm font-medium">Blood Test Results</h4>
              <p className="text-xs text-muted-foreground">Jun 10, 2023</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-7 w-7 md:h-8 md:w-8 p-0" title="Download">
            <Download className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between p-2 md:p-3 border rounded-lg bg-card hover:bg-secondary/40 transition-colors duration-200">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="bg-primary/10 p-1.5 md:p-2 rounded-full">
              <FileText className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
            </div>
            <div>
              <h4 className="text-xs md:text-sm font-medium">Treatment Plan PDF</h4>
              <p className="text-xs text-muted-foreground">Jun 15, 2023</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-7 w-7 md:h-8 md:w-8 p-0" title="Download">
            <Download className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MedicalDocuments;
