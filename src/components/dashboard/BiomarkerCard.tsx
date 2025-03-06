
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { InfoIcon } from 'lucide-react';
import Tooltip from '../ui/Tooltip';

interface BiomarkerCardProps {
  name: string;
  value: number;
  unit: string;
  normalRange: string;
  status: 'normal' | 'elevated' | 'low' | 'critical';
  lastUpdated: string;
  className?: string;
}

const BiomarkerCard: React.FC<BiomarkerCardProps> = ({
  name,
  value,
  unit,
  normalRange,
  status,
  lastUpdated,
  className
}) => {
  const pathRef = useRef<SVGCircleElement>(null);
  const [circumference, setCircumference] = useState(0);
  const [percentage, setPercentage] = useState(0);
  
  // Calculate the percentage based on status
  useEffect(() => {
    let percent = 0;
    switch (status) {
      case 'normal':
        percent = 85;
        break;
      case 'elevated':
        percent = 60;
        break;
      case 'low':
        percent = 40;
        break;
      case 'critical':
        percent = 20;
        break;
    }
    setPercentage(percent);
  }, [status]);
  
  useEffect(() => {
    if (pathRef.current) {
      const radius = pathRef.current.r.baseVal.value;
      const calculatedCircumference = 2 * Math.PI * radius;
      setCircumference(calculatedCircumference);
    }
  }, []);
  
  const getStatusColor = () => {
    switch (status) {
      case 'normal':
        return 'text-medical-green stroke-medical-green';
      case 'elevated':
        return 'text-medical-yellow stroke-medical-yellow';
      case 'low':
        return 'text-medical-blue stroke-medical-blue';
      case 'critical':
        return 'text-medical-red stroke-medical-red';
      default:
        return 'text-medical-green stroke-medical-green';
    }
  };
  
  const getStatusLabel = () => {
    switch (status) {
      case 'normal':
        return 'Normal';
      case 'elevated':
        return 'Elevated';
      case 'low':
        return 'Low';
      case 'critical':
        return 'Critical';
    }
  };

  return (
    <motion.div
      className={cn("biomarker-card", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-lg font-semibold">{name}</h3>
            <Tooltip content={`Normal range: ${normalRange} ${unit}`} position="right">
              <InfoIcon className="w-4 h-4 text-muted-foreground" />
            </Tooltip>
          </div>
          <p className="text-xs text-muted-foreground">Last updated: {lastUpdated}</p>
        </div>
        <span className={cn(
          "px-2 py-1 rounded-full text-xs font-medium",
          status === 'normal' && "bg-medical-green/20",
          status === 'elevated' && "bg-medical-yellow/20",
          status === 'low' && "bg-medical-blue/20",
          status === 'critical' && "bg-medical-red/20",
        )}>
          {getStatusLabel()}
        </span>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="relative w-20 h-20">
          <svg width="100%" height="100%" viewBox="0 0 100 100" className="rotate-[-90deg]">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              className="stroke-muted/20"
              strokeWidth="8"
            />
            <circle
              ref={pathRef}
              cx="50"
              cy="50"
              r="40"
              fill="none"
              className={getStatusColor()}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (percentage / 100) * circumference}
              style={{
                transition: 'stroke-dashoffset 1s ease-in-out',
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold">{percentage}%</span>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="text-3xl font-bold mb-1 flex items-center gap-2">
            {value} <span className="text-base font-normal text-muted-foreground">{unit}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Range: {normalRange} {unit}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default BiomarkerCard;
