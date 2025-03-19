
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserCircle, HeartPulse, PhoneCall } from 'lucide-react';

interface UserTypeSelectorProps {
  userType: 'doctor' | 'patient' | 'receptionist';
  onTabChange: (value: string) => void;
}

const UserTypeSelector: React.FC<UserTypeSelectorProps> = ({ userType, onTabChange }) => {
  return (
    <Tabs value={userType} onValueChange={onTabChange} className="mb-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="doctor" className="flex items-center gap-2">
          <UserCircle className="w-4 h-4" />
          <span>Doctor</span>
        </TabsTrigger>
        <TabsTrigger value="patient" className="flex items-center gap-2">
          <HeartPulse className="w-4 h-4" />
          <span>Patient</span>
        </TabsTrigger>
        <TabsTrigger value="receptionist" className="flex items-center gap-2">
          <PhoneCall className="w-4 h-4" />
          <span>Staff</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default UserTypeSelector;
