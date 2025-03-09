import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Search, SplitSquareVertical, MoveVertical, RotateCcw } from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import PatientProfileCard from '@/components/dashboard/PatientProfileCard';
import AnatomicalViewer from '@/components/dashboard/AnatomicalViewer';
import MedicalRecordsTabs from '@/components/dashboard/MedicalRecordsTabs';

const Dashboard: React.FC = () => {
  const [viewMode, setViewMode] = useState<'split' | 'vertical'>('split');
  const [selectedPatient, setSelectedPatient] = useState({
    id: 1,
    name: "Nikolas Pascal",
    age: 32,
    gender: "Male",
    address: "800 Bay St, San Francisco, CA 94133",
    condition: "Calcific tendinitis of the shoulder",
    icdCode: "M75.3",
  });
  const { toast } = useToast();

  const handleViewModeChange = (value: string) => {
    if (value === 'split' || value === 'vertical') {
      setViewMode(value);
    }
  };

  const handleResetView = () => {
    toast({
      title: "View Reset",
      description: "Dashboard view has been reset to default.",
    });
  };

  const handleSelectBodyPart = (part: string) => {
    toast({
      title: `${part} Selected`,
      description: `Viewing ${part} system information.`,
    });
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
          <div className="mb-6 max-w-[1600px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Patient Details</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  View and manage patient medical records
                </p>
              </div>
              
              <div className="flex items-center mt-4 md:mt-0 gap-2">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search patients..." 
                    className="pl-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  />
                </div>
                
                <ToggleGroup type="single" value={viewMode} onValueChange={handleViewModeChange} className="border rounded-md">
                  <ToggleGroupItem value="split" aria-label="Split View">
                    <SplitSquareVertical className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="vertical" aria-label="Vertical View">
                    <MoveVertical className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
                
                <Button variant="outline" size="icon" onClick={handleResetView}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className={`grid gap-6 ${viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
              <div className={viewMode === 'split' ? 'lg:col-span-2' : ''}>
                <AnatomicalViewer onSelectBodyPart={handleSelectBodyPart} />
              </div>
              
              <div>
                <PatientProfileCard patient={selectedPatient} />
              </div>
              
              <div className={viewMode === 'split' ? 'lg:col-span-3' : ''}>
                <MedicalRecordsTabs patientId={selectedPatient.id} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
