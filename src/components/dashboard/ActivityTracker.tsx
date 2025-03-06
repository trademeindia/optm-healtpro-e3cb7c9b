
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Activity } from 'lucide-react';

interface ActivityData {
  day: string;
  value: number;
}

interface ActivityTrackerProps {
  title: string;
  data: ActivityData[];
  unit: string;
  currentValue: number;
  className?: string;
}

const ActivityTracker: React.FC<ActivityTrackerProps> = ({
  title,
  data,
  unit,
  currentValue,
  className,
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <motion.div
      className={cn("glass-morphism rounded-2xl p-6", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Activity className="w-5 h-5 text-medical-green" />
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <span className="text-3xl font-bold">{currentValue.toLocaleString()}</span>
        <span className="text-muted-foreground">{unit}</span>
      </div>
      
      <div className="flex items-end justify-between h-32 gap-1">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <motion.div 
              className="w-full bg-primary/20 rounded-t-sm relative overflow-hidden"
              style={{ height: `${(item.value / maxValue) * 100}%` }}
              initial={{ height: 0 }}
              animate={{ height: `${(item.value / maxValue) * 100}%` }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.div 
                className="absolute bottom-0 left-0 w-full bg-primary"
                style={{ height: `${(item.value / maxValue) * 100}%` }}
                initial={{ height: 0 }}
                animate={{ height: `${(item.value / maxValue) * 100}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            </motion.div>
            <span className="text-xs mt-2 text-muted-foreground">{item.day}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ActivityTracker;
