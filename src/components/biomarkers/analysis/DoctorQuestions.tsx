
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

const DoctorQuestions: React.FC = () => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Questions for your doctor</h3>
      <Textarea 
        placeholder="Write any questions you want to ask your doctor about this report..."
        className="min-h-[100px]"
      />
    </div>
  );
};

export default DoctorQuestions;
