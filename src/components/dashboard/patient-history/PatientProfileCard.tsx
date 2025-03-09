
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PatientData } from './types';

interface PatientProfileCardProps {
  patient: PatientData;
  editedPatient: PatientData;
  editMode: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setEditedPatient: React.Dispatch<React.SetStateAction<PatientData>>;
}

const PatientProfileCard: React.FC<PatientProfileCardProps> = ({
  patient,
  editedPatient,
  editMode,
  handleInputChange,
  setEditedPatient
}) => {
  return (
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Patient Name</Label>
            {editMode ? (
              <Input 
                id="name"
                name="name"
                value={editedPatient.name}
                onChange={handleInputChange}
              />
            ) : (
              <div className="text-lg font-medium mt-1">{patient.name}</div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age">Age</Label>
              {editMode ? (
                <Input 
                  id="age"
                  name="age"
                  type="number"
                  value={editedPatient.age}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="mt-1">{patient.age} years</div>
              )}
            </div>
            
            <div>
              <Label htmlFor="gender">Gender</Label>
              {editMode ? (
                <select 
                  id="gender"
                  name="gender"
                  className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  value={editedPatient.gender}
                  onChange={(e) => setEditedPatient(prev => ({...prev, gender: e.target.value}))}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <div className="mt-1">{patient.gender}</div>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="condition">Medical Condition</Label>
            {editMode ? (
              <Input 
                id="condition"
                name="condition"
                value={editedPatient.condition}
                onChange={handleInputChange}
              />
            ) : (
              <div className="mt-1">{patient.condition}</div>
            )}
          </div>
          
          <div>
            <Label htmlFor="icdCode">ICD Code</Label>
            {editMode ? (
              <Input 
                id="icdCode"
                name="icdCode"
                value={editedPatient.icdCode}
                onChange={handleInputChange}
              />
            ) : (
              <div className="mt-1 font-mono">{patient.icdCode}</div>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="address">Address</Label>
            {editMode ? (
              <Textarea 
                id="address"
                name="address"
                value={editedPatient.address}
                onChange={handleInputChange}
              />
            ) : (
              <div className="mt-1">{patient.address}</div>
            )}
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            {editMode ? (
              <Input 
                id="phone"
                name="phone"
                value={editedPatient.phone}
                onChange={handleInputChange}
              />
            ) : (
              <div className="mt-1">{patient.phone}</div>
            )}
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            {editMode ? (
              <Input 
                id="email"
                name="email"
                value={editedPatient.email}
                onChange={handleInputChange}
              />
            ) : (
              <div className="mt-1">{patient.email}</div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lastVisit">Last Visit</Label>
              {editMode ? (
                <Input 
                  id="lastVisit"
                  name="lastVisit"
                  type="date"
                  value={editedPatient.lastVisit}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="mt-1">{patient.lastVisit}</div>
              )}
            </div>
            
            <div>
              <Label htmlFor="nextVisit">Next Appointment</Label>
              {editMode ? (
                <Input 
                  id="nextVisit"
                  name="nextVisit"
                  type="date"
                  value={editedPatient.nextVisit}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="mt-1">{patient.nextVisit}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  );
};

export default PatientProfileCard;
