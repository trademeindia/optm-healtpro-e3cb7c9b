
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  age: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: "Age must be a positive number."
  }),
  gender: z.string().min(1, { message: "Please select a gender." }),
  address: z.string().min(3, { message: "Address must be at least 3 characters." }),
  phone: z.string().min(5, { message: "Phone number must be at least 5 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  condition: z.string().min(2, { message: "Condition must be at least 2 characters." }),
  icdCode: z.string().min(1, { message: "ICD code is required." }),
});

type FormValues = z.infer<typeof formSchema>;

interface NewPatientFormProps {
  onSave: (patientData: any) => void;
  onCancel: () => void;
}

const NewPatientForm: React.FC<NewPatientFormProps> = ({ onSave, onCancel }) => {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      age: '',
      gender: '',
      address: '',
      phone: '',
      email: '',
      condition: '',
      icdCode: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    // Create a new patient object with the form data
    const newPatient = {
      id: Date.now(), // Generate a temporary ID (in a real app, the backend would provide this)
      name: data.name,
      age: parseInt(data.age),
      gender: data.gender,
      address: data.address,
      phone: data.phone,
      email: data.email,
      condition: data.condition,
      icdCode: data.icdCode,
      lastVisit: 'New Patient',
      nextVisit: 'Not Scheduled',
      medicalRecords: []
    };
    
    onSave(newPatient);
    
    toast({
      title: "Patient Added",
      description: `${data.name} has been added to your patient records.`,
    });
  };

  return (
    <DialogContent className="sm:max-w-[550px]">
      <DialogHeader>
        <DialogTitle>Add New Patient</DialogTitle>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input placeholder="35" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St, City, State, ZIP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="(555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="patient@example.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diagnosis</FormLabel>
                  <FormControl>
                    <Input placeholder="Lower back pain" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="icdCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ICD Code</FormLabel>
                  <FormControl>
                    <Input placeholder="M54.5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              Add Patient
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
};

export default NewPatientForm;
