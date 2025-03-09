
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface MedicalRecordsTabsProps {
  patientId: number;
}

const MedicalRecordsTabs: React.FC<MedicalRecordsTabsProps> = ({ patientId }) => {
  const [activeTab, setActiveTab] = useState('xrays');
  const { toast } = useToast();
  
  const handleAddRecord = () => {
    toast({
      title: "Add Record",
      description: "Record upload functionality coming soon",
    });
  };
  
  return (
    <Card className="glass-morphism">
      <CardHeader className="pb-2">
        <CardTitle>Medical Records</CardTitle>
        <CardDescription>View and manage patient medical records</CardDescription>
      </CardHeader>
      <CardContent className="p-3">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full h-auto mb-4 grid grid-cols-5 p-1">
            <TabsTrigger value="xrays" className="text-sm py-2">X-Rays & Scans</TabsTrigger>
            <TabsTrigger value="bloodtests" className="text-sm py-2">Blood Tests</TabsTrigger>
            <TabsTrigger value="medications" className="text-sm py-2">Medications</TabsTrigger>
            <TabsTrigger value="notes" className="text-sm py-2">Clinical Notes</TabsTrigger>
            <TabsTrigger value="biomarkers" className="text-sm py-2">Biomarkers</TabsTrigger>
          </TabsList>
          
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {activeTab === 'xrays' && "X-Rays & Scan Reports"}
              {activeTab === 'bloodtests' && "Blood Test Reports"}
              {activeTab === 'medications' && "Current Medications"}
              {activeTab === 'notes' && "Clinical Notes"}
              {activeTab === 'biomarkers' && "Biomarker Data"}
            </h3>
            
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search records..." className="pl-9 h-9 w-[200px]" />
              </div>
              <Button className="gap-1" onClick={handleAddRecord}>
                <Plus className="h-4 w-4" />
                Add Record
              </Button>
            </div>
          </div>
          
          <TabsContent value="xrays" className="mt-0">
            <p className="text-sm text-muted-foreground mb-6">All imaging studies for this patient</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="border rounded-lg overflow-hidden"
              >
                <div className="h-40 bg-gray-100 flex items-center justify-center">
                  <img 
                    src="/lovable-uploads/d8b182a9-ac94-4497-b6c9-770065e4e760.png" 
                    alt="Shoulder X-Ray" 
                    className="max-h-full object-cover" 
                  />
                </div>
                <div className="p-3">
                  <h4 className="font-medium">Left Shoulder X-Ray</h4>
                  <p className="text-xs text-muted-foreground">Jun 5, 2023</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">X-Ray</span>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="border rounded-lg overflow-hidden"
              >
                <div className="h-40 bg-gray-100 flex items-center justify-center">
                  <img 
                    src="/lovable-uploads/b60c3153-1d31-447c-a492-29234c29898a.png" 
                    alt="MRI Shoulder" 
                    className="max-h-full object-cover" 
                  />
                </div>
                <div className="p-3">
                  <h4 className="font-medium">MRI Left Shoulder</h4>
                  <p className="text-xs text-muted-foreground">Jun 7, 2023</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800">MRI</span>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </TabsContent>
          
          <TabsContent value="bloodtests" className="mt-0">
            <p className="text-sm text-muted-foreground mb-6">Blood test results and lab reports</p>
            
            <div className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-5 bg-muted p-3 text-sm font-medium">
                <div>Test Name</div>
                <div>Value</div>
                <div>Normal Range</div>
                <div>Date</div>
                <div>Status</div>
              </div>
              <div className="divide-y">
                <div className="grid grid-cols-5 p-3 text-sm hover:bg-gray-50">
                  <div>Hemoglobin</div>
                  <div>14.2 g/dL</div>
                  <div>13.5-17.5 g/dL</div>
                  <div>Jun 10, 2023</div>
                  <div><span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs">Normal</span></div>
                </div>
                <div className="grid grid-cols-5 p-3 text-sm hover:bg-gray-50">
                  <div>Fasting Blood Sugar</div>
                  <div>116 mg/dL</div>
                  <div>70-99 mg/dL</div>
                  <div>Jun 10, 2023</div>
                  <div><span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-xs">Elevated</span></div>
                </div>
                <div className="grid grid-cols-5 p-3 text-sm hover:bg-gray-50">
                  <div>Cholesterol (Total)</div>
                  <div>195 mg/dL</div>
                  <div>< 200 mg/dL</div>
                  <div>Jun 10, 2023</div>
                  <div><span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs">Normal</span></div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="medications" className="mt-0">
            <p className="text-sm text-muted-foreground mb-6">Current medications and prescriptions</p>
            
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">Naproxen</h4>
                    <p className="text-sm text-muted-foreground">500mg twice daily</p>
                  </div>
                  <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">Anti-inflammatory</span>
                </div>
                <div className="mt-3 pt-3 border-t grid grid-cols-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Start Date</p>
                    <p className="font-medium">Jun 5, 2023</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Duration</p>
                    <p className="font-medium">30 days</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs">Active</span>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">Calcium Supplements</h4>
                    <p className="text-sm text-muted-foreground">1000mg once daily</p>
                  </div>
                  <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-800 text-xs">Supplement</span>
                </div>
                <div className="mt-3 pt-3 border-t grid grid-cols-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Start Date</p>
                    <p className="font-medium">Jun 7, 2023</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Duration</p>
                    <p className="font-medium">90 days</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notes" className="mt-0">
            <p className="text-sm text-muted-foreground mb-6">Clinical notes and observations</p>
            
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">Initial Consultation Note</h4>
                  <span className="text-xs text-muted-foreground">Jun 5, 2023</span>
                </div>
                <p className="text-sm">
                  Patient presented with pain in the left shoulder. Pain is described as sharp and worsens with movement.
                  X-ray shows calcific deposits in the supraspinatus tendon. Diagnosis: Calcific tendinitis of the left shoulder.
                  Treatment plan includes NSAIDs, physical therapy, and calcium supplements.
                </p>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">Follow-up Visit</h4>
                  <span className="text-xs text-muted-foreground">Jun 12, 2023</span>
                </div>
                <p className="text-sm">
                  Patient reports moderate improvement in pain levels. Range of motion is still limited but improving.
                  Continued with current medication regimen. Recommended continued physical therapy sessions.
                  Will reassess in two weeks.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="biomarkers" className="mt-0">
            <p className="text-sm text-muted-foreground mb-6">Key biomarkers and health metrics</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <h4 className="font-medium">Fasting Blood Sugar</h4>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-2xl font-bold">116</span>
                    <span className="text-sm text-muted-foreground ml-1">mg/dL</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground">Normal: 70-99 mg/dL</span>
                    <div className="flex items-center mt-1">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-500">
                        <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 12H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 16V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-xs ml-1 text-red-500">+17%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <h4 className="font-medium">HbA1c</h4>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-2xl font-bold">5.5</span>
                    <span className="text-sm text-muted-foreground ml-1">%</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground">Normal: < 5.7%</span>
                    <div className="flex items-center mt-1">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-500">
                        <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 12H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-xs ml-1 text-green-500">Stable</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <h4 className="font-medium">Blood Pressure</h4>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-2xl font-bold">120/80</span>
                    <span className="text-sm text-muted-foreground ml-1">mmHg</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground">Normal: < 120/80 mmHg</span>
                    <div className="flex items-center mt-1">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-500">
                        <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 12H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-xs ml-1 text-green-500">Stable</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MedicalRecordsTabs;
