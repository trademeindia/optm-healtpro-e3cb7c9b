
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface VitalSignProps {
  label: string;
  value: string;
  unit: string;
  status: 'warning' | 'normal';
  icon: React.ReactNode;
}

const VitalSignCard: React.FC<VitalSignProps> = ({ label, value, unit, status, icon }) => {
  return (
    <Card className={`overflow-hidden border ${
      status === 'warning' ? 'border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800' : 
      'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800'
    }`}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium">{label}</span>
          {icon}
        </div>
        <div className="flex items-baseline mt-1">
          <span className="text-2xl font-bold">{value}</span>
          <span className="ml-1 text-xs text-muted-foreground">{unit}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default VitalSignCard;
