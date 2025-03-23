
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  address: string;
  condition: string;
  icdCode?: string;
}

interface AddPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPatient: (patient: Partial<Patient>) => void;
}

const AddPatientDialog: React.FC<AddPatientDialogProps> = ({ open, onOpenChange, onAddPatient }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [condition, setCondition] = useState('');
  const [icdCode, setIcdCode] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Optional validation
    if (age && (isNaN(Number(age)) || Number(age) <= 0)) {
      newErrors.age = 'Age must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddPatient = () => {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    
    const newPatient: Partial<Patient> = {
      name: `${firstName} ${lastName}`,
      email,
      phone,
      age: age ? parseInt(age) : 0,
      gender,
      address,
      condition: condition || 'Unknown',
      icdCode: icdCode || 'N/A'
    };
    
    onAddPatient(newPatient);
    
    // Reset form
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setAge('');
    setGender('');
    setAddress('');
    setCondition('');
    setIcdCode('');
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden bg-white dark:bg-gray-950 shadow-xl rounded-xl border border-gray-200 dark:border-gray-800">
        <DialogHeader className="px-6 pt-6 pb-2 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Add New Patient</DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Enter patient details to create a new patient record
          </DialogDescription>
        </DialogHeader>
        
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="firstName"
                  className={`mt-1 w-full ${errors.firstName ? 'border-red-500 focus-visible:ring-red-400' : 'border-gray-300 dark:border-gray-600'}`}
                  placeholder="Enter first name" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                {errors.firstName && <span className="text-xs text-red-500 mt-1">{errors.firstName}</span>}
              </div>
              <div>
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="lastName"
                  className={`mt-1 w-full ${errors.lastName ? 'border-red-500 focus-visible:ring-red-400' : 'border-gray-300 dark:border-gray-600'}`}
                  placeholder="Enter last name" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                {errors.lastName && <span className="text-xs text-red-500 mt-1">{errors.lastName}</span>}
              </div>
            </div>
            
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="email"
                className={`mt-1 w-full ${errors.email ? 'border-red-500 focus-visible:ring-red-400' : 'border-gray-300 dark:border-gray-600'}`}
                placeholder="patient@example.com" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <span className="text-xs text-red-500 mt-1">{errors.email}</span>}
            </div>
            
            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone
              </Label>
              <Input 
                id="phone"
                className="mt-1 w-full border-gray-300 dark:border-gray-600" 
                placeholder="(123) 456-7890" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Age
                </Label>
                <Input 
                  id="age"
                  className={`mt-1 w-full ${errors.age ? 'border-red-500 focus-visible:ring-red-400' : 'border-gray-300 dark:border-gray-600'}`}
                  placeholder="Age" 
                  type="number" 
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
                {errors.age && <span className="text-xs text-red-500 mt-1">{errors.age}</span>}
              </div>
              <div>
                <Label htmlFor="gender" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Gender
                </Label>
                <select 
                  id="gender"
                  className="mt-1 w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
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
              <Label htmlFor="address" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Address
              </Label>
              <Input 
                id="address"
                className="mt-1 w-full border-gray-300 dark:border-gray-600" 
                placeholder="Patient address" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="condition" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Medical Condition
              </Label>
              <Input 
                id="condition"
                className="mt-1 w-full border-gray-300 dark:border-gray-600" 
                placeholder="Primary diagnosis" 
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="icdCode" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                ICD Code
              </Label>
              <Input 
                id="icdCode"
                className="mt-1 w-full border-gray-300 dark:border-gray-600" 
                placeholder="ICD-10 code (if applicable)" 
                value={icdCode}
                onChange={(e) => setIcdCode(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <DialogFooter className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="mr-2">
            Cancel
          </Button>
          <Button onClick={handleAddPatient} className="bg-indigo-600 hover:bg-indigo-700">
            Add Patient
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPatientDialog;
