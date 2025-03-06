
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface HealthMetricProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  color?: string;
  className?: string;
}

const HealthMetric: React.FC<HealthMetricProps> = ({
  title,
  value,
  unit,
  change,
  changeLabel,
  icon,
  color = 'bg-primary/10 text-primary',
  className,
}) => {
  const getChangeIcon = () => {
    if (!change) return <Minus className="w-3 h-3" />;
    return change > 0 ? (
      <ArrowUp className="w-3 h-3" />
    ) : (
      <ArrowDown className="w-3 h-3" />
    );
  };

  const getChangeColor = () => {
    if (!change) return 'text-muted-foreground bg-muted/30';
    return change > 0
      ? 'text-medical-green bg-medical-green/10'
      : 'text-medical-red bg-medical-red/10';
  };

  return (
    <motion.div
      className={cn("metric-card p-3 md:p-4", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start justify-between mb-2 md:mb-3">
        <div className="text-xs md:text-sm font-medium text-muted-foreground">{title}</div>
        <div className={cn("w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center", color)}>
          {icon}
        </div>
      </div>
      
      <div className="flex items-baseline gap-1 md:gap-2">
        <div className="text-lg md:text-2xl font-bold">{value}</div>
        {unit && <div className="text-xs md:text-sm text-muted-foreground">{unit}</div>}
      </div>
      
      {typeof change !== 'undefined' && (
        <div className="mt-1 md:mt-2 flex items-center">
          <div className={cn("flex items-center gap-1 text-xs px-1.5 py-0.5 rounded", getChangeColor())}>
            {getChangeIcon()}
            <span>{Math.abs(change)}%</span>
          </div>
          {changeLabel && (
            <span className="text-xs text-muted-foreground ml-1.5">
              {changeLabel}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default HealthMetric;
