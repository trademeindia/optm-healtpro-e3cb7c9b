
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export interface Reminder {
  id: string;
  title: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewReminderData {
  title: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  description?: string;
}

export const useReminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load reminders from localStorage
  const loadReminders = useCallback(() => {
    setIsLoading(true);
    try {
      const savedReminders = localStorage.getItem('clinic-reminders');
      if (savedReminders) {
        setReminders(JSON.parse(savedReminders));
      }
    } catch (error) {
      console.error('Failed to load reminders:', error);
      toast.error('Failed to load reminders');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save reminders to localStorage
  const saveReminders = useCallback((updatedReminders: Reminder[]) => {
    try {
      localStorage.setItem('clinic-reminders', JSON.stringify(updatedReminders));
    } catch (error) {
      console.error('Failed to save reminders:', error);
      toast.error('Failed to save reminders');
    }
  }, []);

  // Add a new reminder
  const addReminder = useCallback((data: NewReminderData): boolean => {
    try {
      const newReminder: Reminder = {
        id: uuidv4(),
        title: data.title,
        dueDate: data.dueDate,
        priority: data.priority,
        description: data.description || '',
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const updatedReminders = [...reminders, newReminder];
      setReminders(updatedReminders);
      saveReminders(updatedReminders);
      
      toast.success('Reminder added successfully');
      return true;
    } catch (error) {
      console.error('Failed to add reminder:', error);
      toast.error('Failed to add reminder');
      return false;
    }
  }, [reminders, saveReminders]);

  // Update an existing reminder
  const updateReminder = useCallback((id: string, data: Partial<Reminder>): boolean => {
    try {
      const reminderIndex = reminders.findIndex(r => r.id === id);
      
      if (reminderIndex === -1) {
        toast.error('Reminder not found');
        return false;
      }
      
      const updatedReminders = [...reminders];
      updatedReminders[reminderIndex] = {
        ...updatedReminders[reminderIndex],
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      setReminders(updatedReminders);
      saveReminders(updatedReminders);
      
      toast.success('Reminder updated successfully');
      return true;
    } catch (error) {
      console.error('Failed to update reminder:', error);
      toast.error('Failed to update reminder');
      return false;
    }
  }, [reminders, saveReminders]);

  // Toggle reminder completion status
  const toggleReminder = useCallback((id: string): boolean => {
    try {
      const reminderIndex = reminders.findIndex(r => r.id === id);
      
      if (reminderIndex === -1) {
        toast.error('Reminder not found');
        return false;
      }
      
      const updatedReminders = [...reminders];
      const currentStatus = updatedReminders[reminderIndex].completed;
      
      updatedReminders[reminderIndex] = {
        ...updatedReminders[reminderIndex],
        completed: !currentStatus,
        updatedAt: new Date().toISOString()
      };
      
      setReminders(updatedReminders);
      saveReminders(updatedReminders);
      
      toast.success(`Reminder marked as ${!currentStatus ? 'completed' : 'incomplete'}`);
      return true;
    } catch (error) {
      console.error('Failed to toggle reminder:', error);
      toast.error('Failed to toggle reminder status');
      return false;
    }
  }, [reminders, saveReminders]);

  // Delete a reminder
  const deleteReminder = useCallback((id: string): boolean => {
    try {
      const updatedReminders = reminders.filter(r => r.id !== id);
      
      if (updatedReminders.length === reminders.length) {
        toast.error('Reminder not found');
        return false;
      }
      
      setReminders(updatedReminders);
      saveReminders(updatedReminders);
      
      toast.success('Reminder deleted successfully');
      return true;
    } catch (error) {
      console.error('Failed to delete reminder:', error);
      toast.error('Failed to delete reminder');
      return false;
    }
  }, [reminders, saveReminders]);

  // Load reminders on component mount
  useEffect(() => {
    loadReminders();
  }, [loadReminders]);

  return {
    reminders,
    isLoading,
    addReminder,
    updateReminder,
    toggleReminder,
    deleteReminder,
    refreshReminders: loadReminders
  };
};
