
import React from 'react';
import { Calendar } from 'lucide-react';

const CalendarTab: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
      <h2 className="text-xl font-bold mb-4">Appointment Calendar</h2>
      <p className="text-muted-foreground mb-6">
        Manage and schedule patient appointments
      </p>
      
      <div className="border border-dashed rounded-lg py-12 flex items-center justify-center">
        <div className="text-center">
          <Calendar className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Calendar View</h3>
          <p className="text-sm text-muted-foreground">
            Calendar features will be available soon
          </p>
        </div>
      </div>
    </div>
  );
};

export default CalendarTab;
