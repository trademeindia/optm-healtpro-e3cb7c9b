
import React from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  onUploadClick: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onUploadClick }) => {
  return (
    <Button 
      className="gap-1.5" 
      onClick={onUploadClick}
    >
      <Upload className="h-4 w-4" />
      <span className="hidden md:inline">Upload</span>
    </Button>
  );
};

export default DashboardHeader;
