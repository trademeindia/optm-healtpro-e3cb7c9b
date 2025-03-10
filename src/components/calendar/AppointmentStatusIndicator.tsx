
import React from 'react';
import { cn } from '@/lib/utils';
import { AppointmentStatus } from '@/types/appointment';

interface AppointmentStatusIndicatorProps {
  status: AppointmentStatus;
  className?: string;
}

const statusConfig: Record<AppointmentStatus, { color: string; label: string }> = {
  scheduled: {
    color: 'bg-blue-500',
    label: 'Scheduled'
  },
  confirmed: {
    color: 'bg-green-500',
    label: 'Confirmed'
  },
  cancelled: {
    color: 'bg-red-500',
    label: 'Cancelled'
  },
  completed: {
    color: 'bg-gray-500',
    label: 'Completed'
  }
};

export const AppointmentStatusIndicator: React.FC<AppointmentStatusIndicatorProps> = ({
  status,
  className
}) => {
  const config = statusConfig[status];
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("w-2 h-2 rounded-full", config.color)} />
      <span className="text-sm text-muted-foreground">{config.label}</span>
    </div>
  );
};
