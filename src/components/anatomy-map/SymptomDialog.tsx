
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { BodyRegion, PainSymptom, painSeverityOptions, painTypeOptions } from './types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface SymptomDialogProps {
  open: boolean;
  onClose: () => void;
  selectedRegion: BodyRegion | null;
  existingSymptom: PainSymptom | null;
  isEditMode: boolean;
  onAdd: (symptom: PainSymptom) => void;
  onUpdate: (symptom: PainSymptom) => void;
  onDelete: (symptomId: string) => void;
}

const formSchema = z.object({
  severity: z.enum(['mild', 'moderate', 'severe']),
  painType: z.string().min(1, { message: 'Pain type is required' }),
  description: z.string().min(3, { message: 'Description must be at least 3 characters' }).max(500),
  triggers: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const SymptomDialog: React.FC<SymptomDialogProps> = ({
  open,
  onClose,
  selectedRegion,
  existingSymptom,
  isEditMode,
  onAdd,
  onUpdate,
  onDelete
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      severity: 'mild',
      painType: '',
      description: '',
      triggers: '',
    }
  });

  // Reset form when dialog opens with existing data or new form
  useEffect(() => {
    if (open) {
      if (existingSymptom && isEditMode) {
        form.reset({
          severity: existingSymptom.severity,
          painType: existingSymptom.painType,
          description: existingSymptom.description,
          triggers: existingSymptom.triggers?.join(', ') || '',
        });
      } else {
        form.reset({
          severity: 'mild',
          painType: '',
          description: '',
          triggers: '',
        });
      }
    }
  }, [open, existingSymptom, isEditMode, form]);

  const onSubmit = (values: FormValues) => {
    const triggers = values.triggers ? values.triggers.split(',').map(t => t.trim()).filter(Boolean) : [];
    
    if (isEditMode && existingSymptom) {
      // Update existing symptom
      const updatedSymptom: PainSymptom = {
        ...existingSymptom,
        severity: values.severity,
        painType: values.painType,
        description: values.description,
        triggers,
        updatedAt: new Date().toISOString(),
      };
      onUpdate(updatedSymptom);
    } else if (selectedRegion) {
      // Add new symptom
      const newSymptom: PainSymptom = {
        id: uuidv4(),
        bodyRegionId: selectedRegion.id,
        severity: values.severity,
        painType: values.painType,
        description: values.description,
        triggers,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
      };
      onAdd(newSymptom);
    }
    
    onClose();
  };

  const handleDelete = () => {
    if (existingSymptom) {
      onDelete(existingSymptom.id);
      onClose();
    }
  };

  if (!selectedRegion) return null;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit Symptom' : 'Add New Symptom'} - {selectedRegion.name}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="severity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pain Severity</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {painSeverityOptions.map(option => (
                          <SelectItem 
                            key={option.value} 
                            value={option.value}
                            className="flex items-center gap-2"
                          >
                            <div className={`w-3 h-3 rounded-full ${option.color} mr-2`}></div>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="painType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pain Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select pain type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {painTypeOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your pain or discomfort..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="triggers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Triggers (Comma separated)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Walking, Sitting, After exercise"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 flex-row sm:justify-between pt-4">
              <div>
                {isEditMode && (
                  <Button 
                    variant="destructive" 
                    type="button" 
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditMode ? 'Update' : 'Save'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SymptomDialog;
