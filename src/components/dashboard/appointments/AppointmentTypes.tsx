
import React from 'react';
import { User, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface NextAppointment {
  date: string;
  time: string;
  doctor: string;
  type: string;
}

interface AppointmentTypesProps {
  nextAppointment?: NextAppointment;
}

const AppointmentTypes: React.FC<AppointmentTypesProps> = ({
  nextAppointment
}) => {
  if (!nextAppointment) return null;

  return (
    <div className="hidden lg:block">
      {/* This is a placeholder for future appointment type analytics */}
    </div>
  );
};

export default AppointmentTypes;
