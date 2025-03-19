
import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import MainContent from '@/components/dashboard/MainContent';
import PatientProfile from '@/components/dashboard/PatientProfile';
import PatientHistory from '@/components/dashboard/PatientHistory';
import PatientAnatomyActivity from '@/components/dashboard/PatientAnatomyActivity';

const DashboardPage: React.FC = () => {
  // Mock data for the patient
  const [selectedRegion, setSelectedRegion] = useState('');
  const mockPatient = {
    id: 1,
    name: 'Jane Doe',
    age: 42,
    gender: 'Female',
    address: '123 Main St, Anytown, USA',
    phone: '(555) 123-4567',
    email: 'jane.doe@example.com',
    condition: 'Lower back pain',
    icdCode: 'M54.5',
    lastVisit: '2023-06-15',
    nextVisit: '2023-07-15',
    medicalRecords: []
  };

  const handleAssignTests = () => {
    console.log('Assigning tests for patient');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="container p-4 md:p-6 mx-auto max-w-7xl">
            <h1 className="text-2xl font-bold mb-6">Doctor Dashboard</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <MainContent 
                  patient={mockPatient}
                  selectedRegion={selectedRegion}
                  onSelectRegion={setSelectedRegion}
                  onAssignTests={handleAssignTests}
                />
              </div>
              
              <div className="lg:col-span-4 space-y-6">
                <PatientProfile 
                  name={mockPatient.name}
                  age={mockPatient.age}
                  gender={mockPatient.gender}
                  address={mockPatient.address}
                  phone={mockPatient.phone}
                  email={mockPatient.email}
                />
                <PatientAnatomyActivity patientId={mockPatient.id} />
                <PatientHistory 
                  patient={mockPatient}
                  onClose={() => console.log('Close history')}
                  onUpdate={() => console.log('Update history')}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
