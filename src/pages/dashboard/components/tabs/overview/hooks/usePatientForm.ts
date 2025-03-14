
import { useState } from 'react';
import { toast } from 'sonner';

export interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  address: string;
  condition: string;
  icdCode?: string;
  nextAppointment?: string;
  status?: string;
  nextVisit?: string;
}

export interface PatientFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: string;
  gender: string;
  address: string;
  condition: string;
  icdCode: string;
}

export interface PatientFormErrors {
  [key: string]: string;
}

export function usePatientForm(onAddPatient?: (patient: Partial<Patient>) => void, onClose?: () => void) {
  const [formState, setFormState] = useState<PatientFormState>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    address: '',
    condition: '',
    icdCode: '',
  });
  
  const [errors, setErrors] = useState<PatientFormErrors>({});

  const resetForm = () => {
    setFormState({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      age: '',
      gender: '',
      address: '',
      condition: '',
      icdCode: '',
    });
    setErrors({});
  };

  const handleInputChange = (field: keyof PatientFormState, value: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: PatientFormErrors = {};
    
    if (!formState.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formState.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formState.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Optional validation
    if (formState.age && (isNaN(Number(formState.age)) || Number(formState.age) <= 0)) {
      newErrors.age = 'Age must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    
    const newPatient: Partial<Patient> = {
      name: `${formState.firstName} ${formState.lastName}`,
      email: formState.email,
      phone: formState.phone,
      age: formState.age ? parseInt(formState.age) : 0,
      gender: formState.gender,
      address: formState.address,
      condition: formState.condition || 'Unknown',
      icdCode: formState.icdCode || 'N/A',
      status: 'active',
      nextAppointment: 'Not scheduled',
      nextVisit: 'Not scheduled',
    };
    
    if (onAddPatient) {
      onAddPatient(newPatient);
    } else {
      toast.info("Patient added", {
        description: "Note: No handler was provided for this action",
        duration: 3000
      });
      if (onClose) onClose();
    }
    
    resetForm();
  };

  return {
    formState,
    errors,
    handleInputChange,
    handleSubmit,
    resetForm
  };
}
