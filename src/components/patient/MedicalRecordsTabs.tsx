
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Vial, PillIcon, Clipboard, Activity } from 'lucide-react';

interface MedicalRecordsTabsProps {
  patient: {
    id: number;
    name: string;
  };
  onAddRecord: (type: string) => void;
}

const MedicalRecordsTabs: React.FC<MedicalRecordsTabsProps> = ({ patient, onAddRecord }) => {
  const [activeTab, setActiveTab] = useState('xrays');

  const tabOptions = [
    { id: 'xrays', label: 'X-Rays & Scans', icon: <FileText className="h-4 w-4 mr-1" /> },
    { id: 'bloodTests', label: 'Blood Tests', icon: <Vial className="h-4 w-4 mr-1" /> },
    { id: 'medications', label: 'Medications', icon: <PillIcon className="h-4 w-4 mr-1" /> },
    { id: 'clinicalNotes', label: 'Clinical Notes', icon: <Clipboard className="h-4 w-4 mr-1" /> },
    { id: 'biomarkers', label: 'Biomarkers', icon: <Activity className="h-4 w-4 mr-1" /> }
  ];

  // Mock data for each tab
  const mockData = {
    xrays: [],
    bloodTests: [
      { id: 1, name: 'Complete Blood Count', date: '2023-05-15', status: 'Normal' },
      { id: 2, name: 'Lipid Panel', date: '2023-05-15', status: 'Abnormal' }
    ],
    medications: [
      { id: 1, name: 'Ibuprofen', dosage: '200mg', frequency: 'Twice daily', startDate: '2023-05-01' }
    ],
    clinicalNotes: [
      { id: 1, date: '2023-05-15', doctor: 'Dr. Smith', note: 'Patient reports shoulder pain...' }
    ],
    biomarkers: []
  };

  return (
    <Card className="w-full">
      <CardHeader className="p-4 pb-2">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-gray-100 dark:bg-gray-700 w-full overflow-x-auto flex scrollbar-none">
            {tabOptions.map(tab => (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center">
                {tab.icon}
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className="p-4">
        <TabsContent value="xrays" className="mt-0">
          <div className="flex justify-between items-center mb-3">
            <div>
              <CardTitle className="text-xl">X-Rays & Scan Reports</CardTitle>
              <CardDescription>All imaging studies for this patient</CardDescription>
            </div>
            <Button onClick={() => onAddRecord('xray')} className="flex items-center">
              <Plus className="h-4 w-4 mr-1" />
              Add Record
            </Button>
          </div>
          
          {mockData.xrays.length === 0 ? (
            <div className="text-center py-8 border border-dashed rounded-lg">
              <p className="text-muted-foreground mb-3">No X-Ray or scan records found</p>
              <Button onClick={() => onAddRecord('xray')} variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add first record
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {mockData.xrays.map(record => (
                <Card key={record.id}>
                  <CardContent className="p-3">
                    {record.name}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="bloodTests" className="mt-0">
          <div className="flex justify-between items-center mb-3">
            <div>
              <CardTitle className="text-xl">Blood Tests</CardTitle>
              <CardDescription>Laboratory test results</CardDescription>
            </div>
            <Button onClick={() => onAddRecord('bloodTest')} className="flex items-center">
              <Plus className="h-4 w-4 mr-1" />
              Add Record
            </Button>
          </div>
          
          {mockData.bloodTests.length === 0 ? (
            <div className="text-center py-8 border border-dashed rounded-lg">
              <p className="text-muted-foreground mb-3">No blood test records found</p>
              <Button onClick={() => onAddRecord('bloodTest')} variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add first record
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {mockData.bloodTests.map(record => (
                <Card key={record.id}>
                  <CardContent className="p-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{record.name}</p>
                      <p className="text-sm text-muted-foreground">{record.date}</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs ${
                      record.status === 'Normal' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {record.status}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Similar structure for other tabs */}
        <TabsContent value="medications" className="mt-0">
          <div className="flex justify-between items-center mb-3">
            <div>
              <CardTitle className="text-xl">Medications</CardTitle>
              <CardDescription>Current and past medications</CardDescription>
            </div>
            <Button onClick={() => onAddRecord('medication')} className="flex items-center">
              <Plus className="h-4 w-4 mr-1" />
              Add Medication
            </Button>
          </div>
          
          {mockData.medications.length === 0 ? (
            <div className="text-center py-8 border border-dashed rounded-lg">
              <p className="text-muted-foreground mb-3">No medications found</p>
              <Button onClick={() => onAddRecord('medication')} variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add first medication
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {mockData.medications.map(med => (
                <Card key={med.id}>
                  <CardContent className="p-3">
                    <p className="font-medium">{med.name} ({med.dosage})</p>
                    <p className="text-sm text-muted-foreground">
                      {med.frequency} - Starting {med.startDate}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="clinicalNotes" className="mt-0">
          <div className="flex justify-between items-center mb-3">
            <div>
              <CardTitle className="text-xl">Clinical Notes</CardTitle>
              <CardDescription>Consultation and progress notes</CardDescription>
            </div>
            <Button onClick={() => onAddRecord('clinicalNote')} className="flex items-center">
              <Plus className="h-4 w-4 mr-1" />
              Add Note
            </Button>
          </div>
          
          {mockData.clinicalNotes.length === 0 ? (
            <div className="text-center py-8 border border-dashed rounded-lg">
              <p className="text-muted-foreground mb-3">No clinical notes found</p>
              <Button onClick={() => onAddRecord('clinicalNote')} variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add first note
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {mockData.clinicalNotes.map(note => (
                <Card key={note.id}>
                  <CardContent className="p-3">
                    <div className="flex justify-between">
                      <p className="font-medium">{note.doctor}</p>
                      <p className="text-sm text-muted-foreground">{note.date}</p>
                    </div>
                    <p className="text-sm mt-1">{note.note}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="biomarkers" className="mt-0">
          <div className="flex justify-between items-center mb-3">
            <div>
              <CardTitle className="text-xl">Biomarkers</CardTitle>
              <CardDescription>Health metrics and measurements</CardDescription>
            </div>
            <Button onClick={() => onAddRecord('biomarker')} className="flex items-center">
              <Plus className="h-4 w-4 mr-1" />
              Add Biomarker
            </Button>
          </div>
          
          {mockData.biomarkers.length === 0 ? (
            <div className="text-center py-8 border border-dashed rounded-lg">
              <p className="text-muted-foreground mb-3">No biomarker records found</p>
              <Button onClick={() => onAddRecord('biomarker')} variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add first biomarker
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {mockData.biomarkers.map(marker => (
                <Card key={marker.id}>
                  <CardContent className="p-3">
                    {marker.name}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </CardContent>
    </Card>
  );
};

export default MedicalRecordsTabs;
