
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  Heart, Activity, Thermometer, Droplet, Brain, Microscope, 
  Plus, Search, Filter, ArrowUpDown, FileText, Download
} from 'lucide-react';

import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import BiomarkerCard from '@/components/dashboard/BiomarkerCard';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const BiomarkersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();

  // Sample biomarker categories
  const categories = [
    { id: "all", label: "All Biomarkers" },
    { id: "inflammation", label: "Inflammation" },
    { id: "cardiac", label: "Cardiac" },
    { id: "metabolic", label: "Metabolic" },
    { id: "hormonal", label: "Hormonal" }
  ];

  // Sample biomarker data
  const biomarkerData = [
    {
      id: 1,
      name: "C-Reactive Protein (CRP)",
      value: 5.5,
      unit: "mg/L",
      normalRange: "0.0 - 8.0",
      status: "normal",
      category: "inflammation",
      lastUpdated: "Jun 10, 2023",
      patient: "Nikolas Pascal"
    },
    {
      id: 2,
      name: "Interleukin-6 (IL-6)",
      value: 12.8,
      unit: "pg/mL",
      normalRange: "0.0 - 7.0",
      status: "elevated",
      category: "inflammation",
      lastUpdated: "Jun 10, 2023",
      patient: "Nikolas Pascal"
    },
    {
      id: 3,
      name: "Troponin I",
      value: 0.02,
      unit: "ng/mL",
      normalRange: "0.0 - 0.04",
      status: "normal",
      category: "cardiac",
      lastUpdated: "Jun 12, 2023",
      patient: "Emma Rodriguez"
    },
    {
      id: 4,
      name: "Blood Glucose (Fasting)",
      value: 105,
      unit: "mg/dL",
      normalRange: "70 - 100",
      status: "elevated",
      category: "metabolic",
      lastUpdated: "Jun 15, 2023",
      patient: "Marcus Johnson"
    },
    {
      id: 5,
      name: "Thyroid Stimulating Hormone (TSH)",
      value: 2.5,
      unit: "μIU/mL",
      normalRange: "0.4 - 4.0",
      status: "normal",
      category: "hormonal",
      lastUpdated: "Jun 8, 2023",
      patient: "Emma Rodriguez"
    }
  ];

  const handleAddBiomarker = () => {
    toast({
      title: "Biomarker Added",
      description: "New biomarker has been successfully added to the system.",
    });
    setShowAddDialog(false);
  };

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Biomarker data is being exported to CSV format.",
    });
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Biomarkers</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Track and analyze patient biomarkers and health indicators
                </p>
              </div>
              
              <div className="flex items-center mt-4 md:mt-0 gap-2">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search biomarkers..." 
                    className="pl-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  />
                </div>
                
                <Button 
                  className="gap-1.5" 
                  onClick={() => setShowAddDialog(true)}
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden md:inline">Add Biomarker</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="gap-1.5"
                  onClick={handleExportData}
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden md:inline">Export</span>
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
                {categories.map(category => (
                  <TabsTrigger key={category.id} value={category.id} className="rounded-md">
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {categories.map(category => (
                <TabsContent key={category.id} value={category.id} className="mt-0 space-y-4">
                  {biomarkerData
                    .filter(biomarker => category.id === "all" || biomarker.category === category.id)
                    .map(biomarker => (
                      <BiomarkerCard
                        key={biomarker.id}
                        name={biomarker.name}
                        value={biomarker.value}
                        unit={biomarker.unit}
                        normalRange={biomarker.normalRange}
                        status={biomarker.status}
                        lastUpdated={biomarker.lastUpdated}
                        patientName={biomarker.patient}
                      />
                    ))
                  }
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </main>
      </div>
      
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Biomarker</DialogTitle>
            <DialogDescription>
              Enter the biomarker details for the patient record.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Biomarker Name</label>
              <Input placeholder="e.g., C-Reactive Protein (CRP)" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Value</label>
                <Input type="number" step="0.01" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Unit</label>
                <Input placeholder="e.g., mg/L" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Normal Range</label>
              <Input placeholder="e.g., 0.0 - 8.0" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <option value="inflammation">Inflammation</option>
                <option value="cardiac">Cardiac</option>
                <option value="metabolic">Metabolic</option>
                <option value="hormonal">Hormonal</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Patient</label>
              <select className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <option value="1">Nikolas Pascal</option>
                <option value="2">Emma Rodriguez</option>
                <option value="3">Marcus Johnson</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBiomarker}>
              Add Biomarker
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BiomarkersPage;
