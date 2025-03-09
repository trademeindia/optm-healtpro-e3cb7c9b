
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckCircle, Circle, Clock } from 'lucide-react';

interface TreatmentTask {
  id: string;
  title: string;
  time: string;
  completed: boolean;
}

interface TreatmentPlanProps {
  title: string;
  date: string;
  tasks: TreatmentTask[];
  progress: number;
  className?: string;
}

const TreatmentPlan: React.FC<TreatmentPlanProps> = ({
  title,
  date,
  tasks,
  progress,
  className,
}) => {
  return (
    <motion.div
      className={cn("glass-morphism rounded-2xl p-6", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="text-sm text-muted-foreground">{date}</div>
      </div>
      
      <div className="w-full h-2 bg-secondary rounded-full mb-6 overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center gap-3">
            <div className="flex-shrink-0">
              {task.completed ? (
                <CheckCircle className="w-5 h-5 text-medical-green" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <div className={cn(
                "text-sm font-medium",
                task.completed ? "text-muted-foreground line-through" : ""
              )}>
                {task.title}
              </div>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="w-3 h-3 mr-1" /> {task.time}
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-6 py-2 bg-accent text-accent-foreground rounded-lg text-sm font-medium transition-colors hover:bg-accent/90">
        View Complete Plan
      </button>
    </motion.div>
  );
};

export default TreatmentPlan;
