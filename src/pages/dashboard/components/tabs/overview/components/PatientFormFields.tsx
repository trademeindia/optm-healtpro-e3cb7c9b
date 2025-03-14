
import React from 'react';
import { Input } from '@/components/ui/input';
import { PatientFormState, PatientFormErrors } from '../hooks/usePatientForm';

interface PatientFormFieldsProps {
  formState: PatientFormState;
  errors: PatientFormErrors;
  onChange: (field: keyof PatientFormState, value: string) => void;
}

const PatientFormFields: React.FC<PatientFormFieldsProps> = ({
  formState,
  errors,
  onChange
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">First Name *</label>
          <Input 
            className={`w-full ${errors.firstName ? 'border-red-500' : ''}`}
            placeholder="Enter first name" 
            value={formState.firstName}
            onChange={(e) => onChange('firstName', e.target.value)}
          />
          {errors.firstName && <span className="text-xs text-red-500">{errors.firstName}</span>}
        </div>
        <div>
          <label className="text-sm font-medium">Last Name *</label>
          <Input 
            className={`w-full ${errors.lastName ? 'border-red-500' : ''}`}
            placeholder="Enter last name" 
            value={formState.lastName}
            onChange={(e) => onChange('lastName', e.target.value)}
          />
          {errors.lastName && <span className="text-xs text-red-500">{errors.lastName}</span>}
        </div>
      </div>
      
      <div>
        <label className="text-sm font-medium">Email *</label>
        <Input 
          className={`w-full ${errors.email ? 'border-red-500' : ''}`}
          placeholder="patient@example.com" 
          type="email" 
          value={formState.email}
          onChange={(e) => onChange('email', e.target.value)}
        />
        {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
      </div>
      
      <div>
        <label className="text-sm font-medium">Phone</label>
        <Input 
          className="w-full" 
          placeholder="(123) 456-7890" 
          value={formState.phone}
          onChange={(e) => onChange('phone', e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Age</label>
          <Input 
            className={`w-full ${errors.age ? 'border-red-500' : ''}`}
            placeholder="Age" 
            type="number" 
            value={formState.age}
            onChange={(e) => onChange('age', e.target.value)}
          />
          {errors.age && <span className="text-xs text-red-500">{errors.age}</span>}
        </div>
        <div>
          <label className="text-sm font-medium">Gender</label>
          <select 
            className="w-full px-3 py-2 border rounded-md" 
            value={formState.gender}
            onChange={(e) => onChange('gender', e.target.value)}
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="text-sm font-medium">Address</label>
        <Input 
          className="w-full" 
          placeholder="Patient address" 
          value={formState.address}
          onChange={(e) => onChange('address', e.target.value)}
        />
      </div>
      
      <div>
        <label className="text-sm font-medium">Medical Condition</label>
        <Input 
          className="w-full" 
          placeholder="Primary diagnosis" 
          value={formState.condition}
          onChange={(e) => onChange('condition', e.target.value)}
        />
      </div>
      
      <div>
        <label className="text-sm font-medium">ICD Code</label>
        <Input 
          className="w-full" 
          placeholder="ICD-10 code (if applicable)" 
          value={formState.icdCode}
          onChange={(e) => onChange('icdCode', e.target.value)}
        />
      </div>
    </div>
  );
};

export default PatientFormFields;
