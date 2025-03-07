
import React from 'react';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MedicalDocuments: React.FC = () => {
  return (
    <div className="glass-morphism rounded-2xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Medical Documents</h3>
        <Button variant="ghost" size="sm" className="text-primary">
          View All
        </Button>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
          <div className="flex items-center">
            <div className="bg-primary/10 p-2 rounded-full mr-3">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-medium">MRI Results</h4>
              <p className="text-xs text-muted-foreground">May 28, 2023</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 3v13"></path>
              <path d="m17 11-5 5-5-5"></path>
              <path d="M5 21h14"></path>
            </svg>
          </Button>
        </div>
        
        <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
          <div className="flex items-center">
            <div className="bg-primary/10 p-2 rounded-full mr-3">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-medium">Blood Test Results</h4>
              <p className="text-xs text-muted-foreground">Jun 10, 2023</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 3v13"></path>
              <path d="m17 11-5 5-5-5"></path>
              <path d="M5 21h14"></path>
            </svg>
          </Button>
        </div>
        
        <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
          <div className="flex items-center">
            <div className="bg-primary/10 p-2 rounded-full mr-3">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-medium">Treatment Plan PDF</h4>
              <p className="text-xs text-muted-foreground">Jun 15, 2023</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 3v13"></path>
              <path d="m17 11-5 5-5-5"></path>
              <path d="M5 21h14"></path>
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MedicalDocuments;
