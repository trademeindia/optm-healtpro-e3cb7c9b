
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, FileText, ChevronLeft } from 'lucide-react';
import PatientHistory from '@/components/dashboard/PatientHistory';

interface MedicalHistoryTabContentProps {
  patients: any[];
  selectedPatient: any;
  onViewPatient: (patientId: number) => void;
  onClosePatientHistory: () => void;
}

const MedicalHistoryTabContent: React.FC<MedicalHistoryTabContentProps> = ({
  patients,
  selectedPatient,
  onViewPatient,
  onClosePatientHistory
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPatients = React.useMemo(() => {
    return patients.filter(patient => 
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toString().includes(searchQuery)
    );
  }, [patients, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          {selectedPatient ? (
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={onClosePatientHistory} className="mr-2">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              Patient History: {selectedPatient.name}
            </div>
          ) : 'Medical History'}
        </h2>
      </div>

      {selectedPatient ? (
        <PatientHistory patient={selectedPatient} onClose={onClosePatientHistory} />
      ) : (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Patient Records</CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search patients..."
                className="pl-8 w-full md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No patients found with the current search criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>{patient.id}</TableCell>
                      <TableCell className="font-medium">{patient.name}</TableCell>
                      <TableCell>{patient.age}</TableCell>
                      <TableCell>{patient.lastVisit}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-1 text-primary" />
                          {patient.recordsCount || 0}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => onViewPatient(patient.id)}>
                          View History
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MedicalHistoryTabContent;
