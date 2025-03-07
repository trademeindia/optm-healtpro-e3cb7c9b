
import React from 'react';
import { Search, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  onUploadClick: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onUploadClick }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Doctor Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your clinic, appointments, and patient care
        </p>
      </div>
      
      <div className="flex items-center mt-4 md:mt-0 gap-2">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search patients, records..." 
            className="pl-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          />
        </div>
        
        <Button 
          className="gap-1.5" 
          onClick={onUploadClick}
        >
          <Upload className="h-4 w-4" />
          <span className="hidden md:inline">Upload</span>
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
