
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { CalendarEvent } from './types';

export interface CalendarEventManagerResult {
  isCreating: boolean;
  isEditing: boolean;
  editingEvent: CalendarEvent | null;
  createDialogOpen: boolean;
  editDialogOpen: boolean;
  openCreateDialog: (date: Date) => void;
  closeCreateDialog: () => void;
  openEditDialog: (event: CalendarEvent) => void;
  closeEditDialog: () => void;
  handleCreateEvent: (eventData: Partial<CalendarEvent>) => Promise<boolean>;
  handleUpdateEvent: (eventId: string, eventData: Partial<CalendarEvent>) => Promise<boolean>;
  handleDeleteEvent: (eventId: string) => Promise<boolean>;
}

export const useCalendarEventManager = (
  onEventChange?: () => void
): CalendarEventManagerResult => {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const openCreateDialog = useCallback((date: Date) => {
    setCreateDialogOpen(true);
  }, []);

  const closeCreateDialog = useCallback(() => {
    setCreateDialogOpen(false);
  }, []);

  const openEditDialog = useCallback((event: CalendarEvent) => {
    setEditingEvent(event);
    setEditDialogOpen(true);
  }, []);

  const closeEditDialog = useCallback(() => {
    setEditDialogOpen(false);
    setEditingEvent(null);
  }, []);

  const handleCreateEvent = useCallback(async (eventData: Partial<CalendarEvent>): Promise<boolean> => {
    setIsCreating(true);
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful creation
      console.log('Creating event:', eventData);
      
      toast.success('Event created successfully', {
        description: 'Your appointment has been added to the calendar',
        duration: 3000
      });
      
      // Notify parent components that events have changed
      if (onEventChange) {
        onEventChange();
      }
      
      return true;
    } catch (error) {
      console.error('Error creating event:', error);
      
      toast.error('Failed to create event', {
        description: 'There was an error creating your event. Please try again.',
        duration: 3000
      });
      
      return false;
    } finally {
      setIsCreating(false);
      closeCreateDialog();
    }
  }, [onEventChange, closeCreateDialog]);

  const handleUpdateEvent = useCallback(async (
    eventId: string, 
    eventData: Partial<CalendarEvent>
  ): Promise<boolean> => {
    setIsEditing(true);
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful update
      console.log('Updating event:', eventId, eventData);
      
      toast.success('Event updated successfully', {
        description: 'Your appointment details have been updated',
        duration: 3000
      });
      
      // Notify parent components that events have changed
      if (onEventChange) {
        onEventChange();
      }
      
      return true;
    } catch (error) {
      console.error('Error updating event:', error);
      
      toast.error('Failed to update event', {
        description: 'There was an error updating your event. Please try again.',
        duration: 3000
      });
      
      return false;
    } finally {
      setIsEditing(false);
      closeEditDialog();
    }
  }, [onEventChange, closeEditDialog]);

  const handleDeleteEvent = useCallback(async (eventId: string): Promise<boolean> => {
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful deletion
      console.log('Deleting event:', eventId);
      
      toast.success('Event deleted successfully', {
        description: 'The appointment has been removed from your calendar',
        duration: 3000
      });
      
      // Notify parent components that events have changed
      if (onEventChange) {
        onEventChange();
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      
      toast.error('Failed to delete event', {
        description: 'There was an error deleting the event. Please try again.',
        duration: 3000
      });
      
      return false;
    } finally {
      closeEditDialog();
    }
  }, [onEventChange, closeEditDialog]);

  return {
    isCreating,
    isEditing,
    editingEvent,
    createDialogOpen,
    editDialogOpen,
    openCreateDialog,
    closeCreateDialog,
    openEditDialog,
    closeEditDialog,
    handleCreateEvent,
    handleUpdateEvent,
    handleDeleteEvent
  };
};
