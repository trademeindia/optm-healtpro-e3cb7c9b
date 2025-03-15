
import React, { useState } from 'react';
import { Bell, Plus, Check, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useReminders, Reminder } from '@/hooks/useReminders';
import ReminderDialog from './reminders/ReminderDialog';
import RemindersList from './reminders/RemindersList';

interface ClinicRemindersProps {
  className?: string;
}

const ClinicReminders: React.FC<ClinicRemindersProps> = ({
  className,
}) => {
  const {
    reminders,
    isLoading,
    addReminder,
    updateReminder,
    toggleReminder,
    deleteReminder
  } = useReminders();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | undefined>(undefined);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');

  const handleAddClick = () => {
    setSelectedReminder(undefined);
    setDialogMode('add');
    setDialogOpen(true);
  };

  const handleEditReminder = (reminder: Reminder) => {
    setSelectedReminder(reminder);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleSaveReminder = (data: any) => {
    if (dialogMode === 'edit' && selectedReminder) {
      return updateReminder(selectedReminder.id, data);
    } else {
      return addReminder(data);
    }
  };

  const handleToggleReminder = (id: string) => {
    toggleReminder(id);
  };

  const handleDeleteReminder = (id: string) => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      deleteReminder(id);
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
            onClick={handleAddClick}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-6">
            <div className="animate-pulse">Loading reminders...</div>
          </div>
        ) : (
          <RemindersList 
            reminders={reminders}
            onToggleReminder={handleToggleReminder}
            onEditReminder={handleEditReminder}
            onDeleteReminder={handleDeleteReminder}
          />
        )}
        
        <Button 
          variant="outline" 
          className="w-full mt-4 gap-1.5" 
          onClick={handleAddClick}
        >
          <Plus className="h-4 w-4" />
          Add Reminder
        </Button>
      </CardContent>

      <ReminderDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveReminder}
        initialData={selectedReminder}
        mode={dialogMode}
      />
    </Card>
  );
};

export default ClinicReminders;
