
import React from 'react';
import { Bell, Plus, Check, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Reminder {
  id: string;
  title: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

interface ClinicRemindersProps {
  reminders: Reminder[];
  className?: string;
  onAddReminder?: () => void;
  onToggleReminder?: (id: string) => void;
}

const ClinicReminders: React.FC<ClinicRemindersProps> = ({
  reminders,
  className,
  onAddReminder,
  onToggleReminder,
}) => {
  const getPriorityColor = (priority: Reminder['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
    }
  };

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Reminders</CardTitle>
            <CardDescription>
              Tasks and clinic reminders
            </CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={onAddReminder}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {reminders.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">No reminders</p>
          ) : (
            reminders.map((reminder) => (
              <div 
                key={reminder.id} 
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-800",
                  reminder.completed && "bg-gray-50 dark:bg-gray-800/50 opacity-70"
                )}
              >
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 rounded-full flex-shrink-0"
                  onClick={() => onToggleReminder && onToggleReminder(reminder.id)}
                >
                  {reminder.completed ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <div className={cn(
                      "w-4 h-4 border-2 rounded-full",
                      getPriorityColor(reminder.priority)
                    )} />
                  )}
                </Button>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "font-medium text-sm",
                    reminder.completed && "line-through text-muted-foreground"
                  )}>
                    {reminder.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Due: {reminder.dueDate}
                  </p>
                </div>
                <Star className={cn(
                  "h-4 w-4",
                  getPriorityColor(reminder.priority),
                  "opacity-" + (reminder.priority === 'high' ? '100' : 
                               reminder.priority === 'medium' ? '75' : '50')
                )} />
              </div>
            ))
          )}
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mt-4 gap-1.5" 
          onClick={onAddReminder}
        >
          <Plus className="h-4 w-4" />
          Add Reminder
        </Button>
      </CardContent>
    </Card>
  );
};

export default ClinicReminders;
