
import { useState, useCallback } from 'react';
import { CalendarEvent } from '../types';
import { EventManagerState, DialogActions } from './types';

export const useDialogState = (): EventManagerState & DialogActions => {
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
  };
};
