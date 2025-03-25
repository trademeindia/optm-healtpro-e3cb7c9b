
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
  existingSymptom?: PainSymptom | null;
  isEditMode?: boolean;
  bodyRegions: BodyRegion[];
  existingSymptoms: PainSymptom[];
  onAddSymptom: (symptom: PainSymptom) => void;
  onUpdateSymptom: (symptom: PainSymptom) => void;
  onDeleteSymptom: (symptomId: string) => void;
  loading: boolean;
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
  existingSymptom = null,
  isEditMode = false,
  onAddSymptom,
  onUpdateSymptom,
  onDeleteSymptom,
  loading,
  bodyRegions,
  existingSymptoms
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
      onUpdateSymptom(updatedSymptom);
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
      onAddSymptom(newSymptom);
    }
    
    onClose();
  };

  const handleDelete = () => {
    if (existingSymptom) {
      onDeleteSymptom(existingSymptom.id);
      onClose();
    }
  };

  if (!selectedRegion) return null;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <DialogHeader className="pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
          <DialogTitle className="text-xl font-bold flex items-center">
            {isEditMode ? 'Edit Symptom' : 'Add New Symptom'} 
            <span className="ml-2 px-3 py-1 text-sm bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 rounded-full">
              {selectedRegion.name}
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="severity"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="font-medium text-gray-700 dark:text-gray-300 flex items-center">
                      <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                      Pain Severity
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800">
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-md">
                        {painSeverityOptions.map(option => (
                          <SelectItem 
                            key={option.value} 
                            value={option.value}
                            className="flex items-center gap-2 py-2 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          >
                            <div className={`w-2 h-2 rounded-full ${option.color} mr-2`}></div>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="painType"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="font-medium text-gray-700 dark:text-gray-300 flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                      Pain Type
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800">
                          <SelectValue placeholder="Select pain type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent position="popper" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-md">
                        {painTypeOptions.map(option => (
                          <SelectItem 
                            key={option.value} 
                            value={option.value}
                            className="py-2 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your pain or discomfort..."
                      className="min-h-24 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="triggers"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                    Triggers (Comma separated)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Walking, Sitting, After exercise"
                      className="w-full h-10 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
              <div>
                {isEditMode && (
                  <Button 
                    variant="destructive" 
                    type="button" 
                    onClick={handleDelete}
                    className="w-full sm:w-auto bg-red-500 hover:bg-red-600"
                  >
                    Delete
                  </Button>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={onClose}
                  className="w-full sm:w-auto border-gray-300 dark:border-gray-600"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
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
