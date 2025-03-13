
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { CalendarEvent } from './types';
import { v4 as uuidv4 } from 'uuid';

export const useCalendarEventManager = (onEventChange?: () => void) => {
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

  const validateEventData = useCallback((eventData: Partial<CalendarEvent>): boolean => {
    if (!eventData.start || !eventData.end) {
      console.error("Missing start or end time");
      return false;
    }
    
    const start = eventData.start instanceof Date ? eventData.start : new Date(eventData.start);
    const end = eventData.end instanceof Date ? eventData.end : new Date(eventData.end);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      console.error("Invalid date object in event data");
      return false;
    }
    
    if (end <= start) {
      console.error("End time must be after start time");
      return false;
    }
    
    return true;
  }, []);

  const handleCreateEvent = useCallback(async (eventData: Partial<CalendarEvent>): Promise<boolean> => {
    setIsCreating(true);
    
    try {
      if (!validateEventData(eventData)) {
        throw new Error("Invalid appointment data");
      }
      
      // Add a unique ID to the event
      const completeEventData: CalendarEvent = {
        id: uuidv4(),
        title: eventData.title || 'Untitled Event',
        start: eventData.start as Date,
        end: eventData.end as Date,
        allDay: eventData.allDay || false,
        description: eventData.description || '',
        location: eventData.location || '',
        patientName: eventData.patientName || '',
        type: eventData.type || '',
        status: 'scheduled',
        ...(eventData as any)
      };
      
      console.log('Creating event with data:', completeEventData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Notify parent components that events have changed
      if (onEventChange) {
        console.log("Triggering calendar refresh after create");
        onEventChange();
      }
      
      // Show a success message with the appointment details
      toast.success(`Appointment created: ${completeEventData.title}`, {
        description: `${new Date(completeEventData.start).toLocaleString()} - ${new Date(completeEventData.end).toLocaleTimeString()}`,
        duration: 3000
      });
      
      return true;
    } catch (error) {
      console.error('Error creating event:', error);
      
      toast.error('Failed to create appointment', {
        description: 'There was an error creating your appointment. Please try again.',
      });
      
      return false;
    } finally {
      setIsCreating(false);
    }
  }, [validateEventData, onEventChange]);

  const handleUpdateEvent = useCallback(async (
    eventId: string, 
    eventData: Partial<CalendarEvent>
  ): Promise<boolean> => {
    setIsEditing(true);
    
    try {
      if (!validateEventData(eventData)) {
        throw new Error("Invalid appointment data");
      }
      
      // In a real app, this would be an API call
      console.log('Updating event:', eventId, {
        title: eventData.title,
        start: eventData.start instanceof Date ? eventData.start.toISOString() : eventData.start,
        end: eventData.end instanceof Date ? eventData.end.toISOString() : eventData.end,
        type: eventData.type,
        patientName: eventData.patientName,
        location: eventData.location,
        status: eventData.status || 'scheduled'
      });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Appointment updated successfully', {
        description: 'Your appointment details have been updated',
        duration: 3000
      });
      
      // Notify parent components that events have changed
      if (onEventChange) {
        console.log("Triggering calendar refresh after update");
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
  }, [validateEventData, onEventChange, closeEditDialog]);

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
        console.log("Triggering calendar refresh after delete");
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
