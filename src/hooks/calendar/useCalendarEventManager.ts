
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
    console.log("Opening create dialog with date:", date);
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
      // Validate that start and end times are actually Date objects
      if (!(eventData.start instanceof Date) || !(eventData.end instanceof Date)) {
        console.error("Invalid date objects for event creation", { 
          start: eventData.start, 
          end: eventData.end 
        });
        throw new Error("Invalid appointment times");
      }
      
      console.log('Creating event with data:', {
        title: eventData.title,
        start: eventData.start.toISOString(),
        end: eventData.end.toISOString(),
        type: eventData.type,
        patientName: eventData.patientName,
        location: eventData.location
      });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Appointment created successfully', {
        description: 'Your appointment has been added to the calendar',
        duration: 3000
      });
      
      // Notify parent components that events have changed
      if (onEventChange) {
        console.log("Notifying parent about event change");
        onEventChange();
      }
      
      return true;
    } catch (error) {
      console.error('Error creating event:', error);
      
      toast.error('Failed to create appointment', {
        description: 'There was an error creating your appointment. Please try again.',
        duration: 3000
      });
      
      return false;
    } finally {
      setIsCreating(false);
    }
  }, [onEventChange]);

  const handleUpdateEvent = useCallback(async (
    eventId: string, 
    eventData: Partial<CalendarEvent>
  ): Promise<boolean> => {
    setIsEditing(true);
    
    try {
      // In a real app, this would be an API call
      console.log('Updating event:', eventId, {
        title: eventData.title,
        start: eventData.start instanceof Date ? eventData.start.toISOString() : eventData.start,
        end: eventData.end instanceof Date ? eventData.end.toISOString() : eventData.end,
        type: eventData.type,
        patientName: eventData.patientName,
        location: eventData.location
      });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Appointment updated successfully', {
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
      
      toast.error('Failed to update appointment', {
        description: 'There was an error updating your appointment. Please try again.',
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
      console.log('Deleting event:', eventId);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Appointment deleted successfully', {
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
      
      toast.error('Failed to delete appointment', {
        description: 'There was an error deleting the appointment. Please try again.',
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
