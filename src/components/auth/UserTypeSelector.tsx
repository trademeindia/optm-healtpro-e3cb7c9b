
import React from 'react';
import { Users, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UserTypeSelectorProps {
  userType: 'doctor' | 'patient';
  onTabChange: (value: string) => void;
}

const UserTypeSelector: React.FC<UserTypeSelectorProps> = ({ 
  userType, 
  onTabChange 
}) => {
  return (
    <Tabs 
      defaultValue={userType} 
      className="mb-6"
      onValueChange={onTabChange}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="doctor" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>Doctor</span>
        </TabsTrigger>
        <TabsTrigger value="patient" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>Patient</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="doctor">
        <h2 className="text-2xl font-bold mb-2">Doctor Login</h2>
        <p className="text-muted-foreground mb-4">Access patient records and treatment plans</p>
      </TabsContent>
      <TabsContent value="patient">
        <h2 className="text-2xl font-bold mb-2">Patient Login</h2>
        <p className="text-muted-foreground mb-4">View your health data and treatment progress</p>
      </TabsContent>
    </Tabs>
  );
};

export default UserTypeSelector;
