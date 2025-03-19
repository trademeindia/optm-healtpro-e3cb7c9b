
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Calendar, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const PersonalInformation: React.FC = () => {
  const { user } = useAuth();
  
  // Fallback data in case user data is incomplete
  const userData = {
    name: user?.name || 'Patient Name',
    email: user?.email || 'patient@example.com',
    phone: '(123) 456-7890',
    dob: 'Jan 15, 1985',
    age: '38',
    sex: 'Male',
    bloodType: 'O+',
    patientId: 'HKLMP003',
    image: user?.picture
  };
  
  return (
    <Card className="border border-border shadow-sm bg-white dark:bg-gray-800">
      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <Avatar className="w-20 h-20 border-2 border-primary/10">
            <AvatarImage src={userData.image} alt={userData.name} />
            <AvatarFallback className="bg-primary/10 text-primary">
              <User className="w-8 h-8" />
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-1 text-center sm:text-left flex-1">
            <h2 className="text-xl font-bold">{userData.name}</h2>
            <p className="text-xs text-muted-foreground">Patient ID: {userData.patientId}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="truncate">{userData.email}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                <span>{userData.phone}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                <span>{userData.dob} ({userData.age} years)</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3.5 h-3.5 rounded-full bg-red-500 flex items-center justify-center text-white text-[10px] font-bold">
                  {userData.bloodType}
                </div>
                <span>Blood Type: {userData.bloodType}</span>
              </div>
            </div>
          </div>
          
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            Edit Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInformation;
