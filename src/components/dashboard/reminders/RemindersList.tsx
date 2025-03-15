
import React from 'react';
import { Check, Clock, Star, MoreVertical, Trash, Edit } from 'lucide-react';
import { Reminder } from '@/hooks/useReminders';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { format, isToday, isThisWeek, isPast, isTomorrow } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface RemindersListProps {
  reminders: Reminder[];
  onToggleReminder: (id: string) => void;
  onEditReminder: (reminder: Reminder) => void;
  onDeleteReminder: (id: string) => void;
}

const RemindersList: React.FC<RemindersListProps> = ({
  reminders,
  onToggleReminder,
  onEditReminder,
  onDeleteReminder
}) => {
  const getPriorityColor = (priority: Reminder['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
    }
  };

  const getDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    
    if (isToday(date)) {
      return 'Today';
    } else if (isTomorrow(date)) {
      return 'Tomorrow';
    } else if (isThisWeek(date)) {
      return format(date, 'EEEE'); // Day name
    } else {
      return format(date, 'MMM d'); // Month day
    }
  };

  const isOverdue = (dateStr: string, completed: boolean) => {
    if (completed) return false;
    const date = new Date(dateStr);
    return isPast(date) && !isToday(date);
  };

  // Sort reminders: incomplete first (sorted by date), then completed
  const sortedReminders = [...reminders].sort((a, b) => {
    // First by completion status
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Then by due date for incomplete items
    if (!a.completed && !b.completed) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    
    // For completed items, sort by most recently completed
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <div className="space-y-2 mt-4">
      {sortedReminders.length === 0 ? (
        <p className="text-center text-muted-foreground py-6">No reminders yet</p>
      ) : (
        sortedReminders.map((reminder) => (
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
              onClick={() => onToggleReminder(reminder.id)}
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
                "font-medium text-sm line-clamp-1",
                reminder.completed && "line-through text-muted-foreground"
              )}>
                {reminder.title}
              </p>
              
              <div className="flex items-center gap-2 mt-1">
                <div className={cn(
                  "flex items-center gap-1 text-xs",
                  isOverdue(reminder.dueDate, reminder.completed) ? "text-red-500" : "text-muted-foreground"
                )}>
                  <Clock className="h-3 w-3" />
                  <span>
                    {isOverdue(reminder.dueDate, reminder.completed) ? 'Overdue: ' : ''}
                    {getDateLabel(reminder.dueDate)} at {format(new Date(reminder.dueDate), 'h:mm a')}
                  </span>
                </div>
              </div>
              
              {reminder.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                  {reminder.description}
                </p>
              )}
            </div>
            
            <Star className={cn(
              "h-4 w-4 flex-shrink-0",
              getPriorityColor(reminder.priority),
              "opacity-" + (reminder.priority === 'high' ? '100' : 
                           reminder.priority === 'medium' ? '75' : '50')
            )} />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onToggleReminder(reminder.id)}>
                  <Check className="h-4 w-4 mr-2" />
                  Mark as {reminder.completed ? 'incomplete' : 'complete'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEditReminder(reminder)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-500 focus:text-red-500" 
                  onClick={() => onDeleteReminder(reminder.id)}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))
      )}
    </div>
  );
};

export default RemindersList;
