
import React, { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const DoctorQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<string[]>([
    "Should I be concerned about my LDL cholesterol level?",
    "What diet changes would you recommend based on these results?"
  ]);
  const [newQuestion, setNewQuestion] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddQuestion = () => {
    if (newQuestion.trim()) {
      setQuestions([...questions, newQuestion.trim()]);
      setNewQuestion('');
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border border-border/50">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Questions for Your Doctor</h3>
        {!isAdding && (
          <Button 
            onClick={() => setIsAdding(true)} 
            variant="outline" 
            size="sm"
            className="h-8"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Question
          </Button>
        )}
      </div>
      
      <div className="space-y-2">
        {questions.map((question, index) => (
          <div key={index} className="flex items-start gap-2 p-2 bg-muted/50 rounded-md">
            <div className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
              {index + 1}
            </div>
            <p className="text-sm">{question}</p>
          </div>
        ))}
        
        {isAdding && (
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Type your question here..."
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleAddQuestion} 
              size="sm" 
              className="shrink-0"
              disabled={!newQuestion.trim()}
            >
              <Check className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button 
              onClick={() => {
                setIsAdding(false);
                setNewQuestion('');
              }} 
              variant="ghost" 
              size="sm"
              className="shrink-0"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
      
      <p className="text-xs text-muted-foreground mt-2">
        Save these questions to discuss during your next appointment with your healthcare provider.
      </p>
    </div>
  );
};

export default DoctorQuestions;
