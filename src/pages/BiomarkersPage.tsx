
import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Filter, ArrowUpDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BiomarkerCard from '@/components/dashboard/BiomarkerCard';

interface Biomarker {
  id: string;
  name: string;
  value: number;
  unit: string;
  normalRange: string;
  status: 'low' | 'normal' | 'elevated' | 'critical';
  timestamp: string;
  patientId: string;
  patientName: string;
}

const BiomarkersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const biomarkers: Biomarker[] = [
    {
      id: "1",
      name: "C-Reactive Protein (CRP)",
      value: 5.5,
      unit: "mg/L",
      normalRange: "0.0 - 8.0",
      status: "normal",
      timestamp: "2023-06-10T14:30:00",
      patientId: "P001",
      patientName: "Nikolas Pascal"
    },
    {
      id: "2",
      name: "Interleukin-6 (IL-6)",
      value: 12.8,
      unit: "pg/mL",
      normalRange: "0.0 - 7.0",
      status: "elevated",
      timestamp: "2023-06-10T14:30:00",
      patientId: "P001",
      patientName: "Nikolas Pascal"
    },
    {
      id: "3",
      name: "Tumor Necrosis Factor (TNF-α)",
      value: 22.3,
      unit: "pg/mL",
      normalRange: "0.0 - 15.0",
      status: "elevated",
      timestamp: "2023-06-10T14:30:00",
      patientId: "P001",
      patientName: "Nikolas Pascal"
    },
    {
      id: "4",
      name: "Erythrocyte Sedimentation Rate (ESR)",
      value: 28,
      unit: "mm/hr",
      normalRange: "0 - 22",
      status: "elevated",
      timestamp: "2023-06-09T10:15:00",
      patientId: "P002",
      patientName: "Emma Rodriguez"
    },
    {
      id: "5",
      name: "White Blood Cell Count (WBC)",
      value: 8.5,
      unit: "K/μL",
      normalRange: "4.5 - 11.0",
      status: "normal",
      timestamp: "2023-06-09T10:15:00",
      patientId: "P002",
      patientName: "Emma Rodriguez"
    },
    {
      id: "6",
      name: "Hemoglobin A1c (HbA1c)",
      value: 5.7,
      unit: "%",
      normalRange: "4.0 - 5.6",
      status: "elevated",
      timestamp: "2023-06-08T09:00:00",
      patientId: "P003",
      patientName: "Marcus Johnson"
    },
    {
      id: "7",
      name: "Creatine Kinase (CK)",
      value: 350,
      unit: "U/L",
      normalRange: "30 - 200",
      status: "elevated",
      timestamp: "2023-06-12T11:45:00",
      patientId: "P003",
      patientName: "Marcus Johnson"
    }
  ];

  const filteredBiomarkers = biomarkers.filter(biomarker => {
    if (activeTab !== "all" && biomarker.status !== activeTab) {
      return false;
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        biomarker.name.toLowerCase().includes(query) ||
        biomarker.patientName.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const handleAddBiomarker = () => {
    toast({
      title: "Add Biomarker",
      description: "Biomarker form would open here."
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export Data",
      description: "Biomarker data export started."
    });
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Biomarkers</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Track and analyze patient biomarkers and inflammation indicators
                </p>
              </div>
              
              <div className="flex items-center mt-4 md:mt-0 gap-2">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search biomarkers..." 
                    className="pl-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Button 
                  className="gap-1.5" 
                  onClick={handleAddBiomarker}
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden md:inline">Add Biomarker</span>
                </Button>
              </div>
            </div>
            
            <Tabs 
              defaultValue="all" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="mb-6 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
                <TabsTrigger value="all" className="rounded-md">
                  All Biomarkers
                </TabsTrigger>
                <TabsTrigger value="normal" className="rounded-md">
                  Normal
                </TabsTrigger>
                <TabsTrigger value="elevated" className="rounded-md">
                  Elevated
                </TabsTrigger>
                <TabsTrigger value="critical" className="rounded-md">
                  Critical
                </TabsTrigger>
                <TabsTrigger value="low" className="rounded-md">
                  Low
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredBiomarkers.map(biomarker => (
                    <BiomarkerCard
                      key={biomarker.id}
                      name={biomarker.name}
                      value={biomarker.value}
                      unit={biomarker.unit}
                      normalRange={biomarker.normalRange}
                      status={biomarker.status}
                      lastUpdated={new Date(biomarker.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="normal" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredBiomarkers.map(biomarker => (
                    <BiomarkerCard
                      key={biomarker.id}
                      name={biomarker.name}
                      value={biomarker.value}
                      unit={biomarker.unit}
                      normalRange={biomarker.normalRange}
                      status={biomarker.status}
                      lastUpdated={new Date(biomarker.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="elevated" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredBiomarkers.map(biomarker => (
                    <BiomarkerCard
                      key={biomarker.id}
                      name={biomarker.name}
                      value={biomarker.value}
                      unit={biomarker.unit}
                      normalRange={biomarker.normalRange}
                      status={biomarker.status}
                      lastUpdated={new Date(biomarker.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="critical" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredBiomarkers.map(biomarker => (
                    <BiomarkerCard
                      key={biomarker.id}
                      name={biomarker.name}
                      value={biomarker.value}
                      unit={biomarker.unit}
                      normalRange={biomarker.normalRange}
                      status={biomarker.status}
                      lastUpdated={new Date(biomarker.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="low" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredBiomarkers.map(biomarker => (
                    <BiomarkerCard
                      key={biomarker.id}
                      name={biomarker.name}
                      value={biomarker.value}
                      unit={biomarker.unit}
                      normalRange={biomarker.normalRange}
                      status={biomarker.status}
                      lastUpdated={new Date(biomarker.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BiomarkersPage;
