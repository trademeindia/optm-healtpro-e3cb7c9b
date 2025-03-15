
import React, { useState } from 'react';
import { Plus, Calendar, Clock, Filter, SortAsc, SortDesc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useReminders, Reminder } from '@/hooks/useReminders';
import ReminderDialog from '@/components/dashboard/reminders/ReminderDialog';
import RemindersList from '@/components/dashboard/reminders/RemindersList';

const RemindersTab: React.FC = () => {
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
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

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

  const filteredReminders = reminders
    .filter(reminder => {
      // Apply search filter
      if (searchQuery && !reminder.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Apply priority filter
      if (filterPriority !== 'all' && reminder.priority !== filterPriority) {
        return false;
      }
      
      // Apply status filter
      if (filterStatus === 'completed' && !reminder.completed) {
        return false;
      }
      if (filterStatus === 'active' && reminder.completed) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by due date
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Reminders</h2>
          <p className="text-muted-foreground">
            Manage your tasks and reminders
          </p>
        </div>
        <Button onClick={handleAddClick} className="self-start">
          <Plus className="h-4 w-4 mr-2" />
          Add Reminder
        </Button>
      </div>
      
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search reminders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex gap-2">
            <Select 
              value={filterPriority} 
              onValueChange={setFilterPriority}
            >
              <SelectTrigger className="w-[120px]">
                <Filter className="h-4 w-4 mr-2" />
                <span>Priority</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={filterStatus} 
              onValueChange={setFilterStatus}
            >
              <SelectTrigger className="w-[120px]">
                <Clock className="h-4 w-4 mr-2" />
                <span>Status</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              title={sortOrder === 'asc' ? 'Sort descending' : 'Sort ascending'}
            >
              {sortOrder === 'asc' ? 
                <SortAsc className="h-4 w-4" /> : 
                <SortDesc className="h-4 w-4" />
              }
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-pulse">Loading reminders...</div>
          </div>
        ) : filteredReminders.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Calendar className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="font-medium text-lg mb-1">No reminders found</h3>
            <p className="text-muted-foreground">
              {searchQuery || filterPriority !== 'all' || filterStatus !== 'all' ? 
                'Try adjusting your filters' : 
                'Create your first reminder to get started'}
            </p>
            <Button className="mt-4" onClick={handleAddClick}>
              <Plus className="h-4 w-4 mr-2" />
              Add Reminder
            </Button>
          </div>
        ) : (
          <RemindersList 
            reminders={filteredReminders}
            onToggleReminder={toggleReminder}
            onEditReminder={handleEditReminder}
            onDeleteReminder={deleteReminder}
          />
        )}
      </Card>
      
      <ReminderDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveReminder}
        initialData={selectedReminder}
        mode={dialogMode}
      />
    </div>
  );
};

export default RemindersTab;
