
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pill, Dumbbell, Stethoscope, CheckCircle, Clock, Calendar } from 'lucide-react';
import { TreatmentTask } from '@/types/treatment';
import { motion } from 'framer-motion';
import { format, isToday, isAfter, isBefore, addHours } from 'date-fns';

interface EnhancedTreatmentTasksProps {
  tasks: TreatmentTask[];
}

const EnhancedTreatmentTasks: React.FC<EnhancedTreatmentTasksProps> = ({ tasks }) => {
  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'medication':
        return <Pill className="h-5 w-5 text-rose-500" />;
      case 'exercise':
        return <Dumbbell className="h-5 w-5 text-green-500" />;
      case 'checkup':
        return <Stethoscope className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-amber-500" />;
    }
  };

  const getTaskBackground = (type: string) => {
    switch (type) {
      case 'medication':
        return 'bg-rose-50 dark:bg-rose-900/20';
      case 'exercise':
        return 'bg-green-50 dark:bg-green-900/20';
      case 'checkup':
        return 'bg-blue-50 dark:bg-blue-900/20';
      default:
        return 'bg-amber-50 dark:bg-amber-900/20';
    }
  };

  const getTaskIconBackground = (type: string) => {
    switch (type) {
      case 'medication':
        return 'bg-rose-100 dark:bg-rose-900/40';
      case 'exercise':
        return 'bg-green-100 dark:bg-green-900/40';
      case 'checkup':
        return 'bg-blue-100 dark:bg-blue-900/40';
      default:
        return 'bg-amber-100 dark:bg-amber-900/40';
    }
  };

  const getTaskStatus = (dueDate: string, status: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    
    if (status === 'completed') {
      return {
        icon: <CheckCircle className="h-4 w-4 text-green-500" />,
        text: 'Completed',
        color: 'text-green-500'
      };
    }
    
    if (isToday(due) && isAfter(due, now)) {
      return {
        icon: <Clock className="h-4 w-4 text-amber-500" />,
        text: `Due ${format(due, 'h:mm a')}`,
        color: 'text-amber-500'
      };
    }
    
    if (isBefore(due, now)) {
      return {
        icon: <Clock className="h-4 w-4 text-red-500" />,
        text: 'Overdue',
        color: 'text-red-500'
      };
    }
    
    return {
      icon: <Calendar className="h-4 w-4 text-blue-500" />,
      text: `Due ${format(due, 'MMM d')}`,
      color: 'text-blue-500'
    };
  };
  
  const taskVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3
      }
    })
  };
  
  // Sort tasks by due date and priority
  const sortedTasks = [...tasks].sort((a, b) => {
    // First sort by status (pending first)
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;
    
    // Then sort by due date
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <Card className="shadow-md border-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Treatment Plan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
            <h3 className="text-lg font-medium">All Done!</h3>
            <p className="text-sm text-muted-foreground">
              You have no pending treatment tasks.
            </p>
          </div>
        ) : (
          sortedTasks.map((task, index) => {
            const taskStatus = getTaskStatus(task.dueDate, task.status);
            
            return (
              <motion.div 
                key={task.id}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={taskVariants}
                className={`p-4 rounded-lg ${getTaskBackground(task.type)} flex items-start space-x-4`}
              >
                <div className={`p-3 rounded-full ${getTaskIconBackground(task.type)} shrink-0`}>
                  {getTaskIcon(task.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium">{task.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
                  
                  <div className="flex items-center mt-2 text-xs">
                    <div className={`flex items-center ${taskStatus.color}`}>
                      {taskStatus.icon}
                      <span className="ml-1">{taskStatus.text}</span>
                    </div>
                    
                    <div className={`ml-4 px-2 py-0.5 rounded-full ${
                      task.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      task.priority === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {task.priority} priority
                    </div>
                  </div>
                </div>
                
                <button className="p-2 hover:bg-white/80 dark:hover:bg-gray-800/50 rounded">
                  <CheckCircle className={`h-5 w-5 ${
                    task.status === 'completed' ? 'text-green-500' : 'text-muted-foreground'
                  }`} />
                </button>
              </motion.div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedTreatmentTasks;
