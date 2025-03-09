
import React, { useState } from 'react';
import { Plus, Check, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Question {
  text: string;
  answer?: string;
}

const DoctorQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([
    {
      text: "Should I be concerned about my LDL cholesterol level?",
      answer: "Based on your LDL level of 130 mg/dL, which is borderline high (optimal is <100 mg/dL), some concern is warranted but it's not an emergency. Consider discussing dietary changes with your doctor and possibly scheduling another test in 3-6 months to monitor changes."
    },
    {
      text: "What diet changes would you recommend based on these results?",
      answer: "Your cholesterol levels suggest reducing saturated fats (red meat, full-fat dairy) and increasing fiber (oats, beans, fruits, vegetables). Adding heart-healthy fats like olive oil, avocados and nuts may help improve your HDL/LDL ratio. Your doctor can provide personalized recommendations."
    }
  ]);
  
  const [newQuestion, setNewQuestion] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isGeneratingAnswer, setIsGeneratingAnswer] = useState(false);

  const generateAIAnswer = async (question: string) => {
    setIsGeneratingAnswer(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate contextual answers based on the question content
    let answer = "";
    if (question.toLowerCase().includes("cholesterol") || question.toLowerCase().includes("ldl")) {
      answer = "Based on your lipid panel, your LDL cholesterol is slightly elevated at 130 mg/dL (optimal <100 mg/dL). This isn't immediately dangerous but warrants attention through diet modification, exercise, and possibly follow-up testing. Discuss this with your doctor at your next appointment.";
    } else if (question.toLowerCase().includes("diet") || question.toLowerCase().includes("food") || question.toLowerCase().includes("eat")) {
      answer = "Based on your results, consider a diet rich in soluble fiber (oats, beans, fruits), omega-3 fatty acids (fatty fish, walnuts), and plant sterols. Limit saturated fats and trans fats. Your doctor can provide more personalized dietary advice.";
    } else if (question.toLowerCase().includes("vitamin") || question.toLowerCase().includes("supplement")) {
      answer = "Your Vitamin D level is 45 ng/mL, which is within the sufficient range. Continue your current supplementation if any. For other supplements, consult with your doctor as needs vary based on individual health factors.";
    } else if (question.toLowerCase().includes("exercise") || question.toLowerCase().includes("physical")) {
      answer = "Regular physical activity can help manage your cholesterol levels. Aim for at least 150 minutes of moderate-intensity exercise weekly. Your healthy blood pressure suggests your current activity level is beneficial, but your doctor can recommend specific exercises.";
    } else {
      answer = "This is important to discuss with your healthcare provider at your next appointment. They can provide personalized advice based on your complete medical history and examination. Consider writing down specific concerns to discuss during your visit.";
    }
    
    setIsGeneratingAnswer(false);
    return answer;
  };

  const handleAddQuestion = async () => {
    if (newQuestion.trim()) {
      setIsGeneratingAnswer(true);
      const aiAnswer = await generateAIAnswer(newQuestion.trim());
      setQuestions([...questions, { text: newQuestion.trim(), answer: aiAnswer }]);
      setNewQuestion('');
      setIsAdding(false);
      setIsGeneratingAnswer(false);
    }
  };

  const handleAskExisting = async (index: number) => {
    setIsGeneratingAnswer(true);
    const updatedQuestions = [...questions];
    const aiAnswer = await generateAIAnswer(updatedQuestions[index].text);
    updatedQuestions[index].answer = aiAnswer;
    setQuestions(updatedQuestions);
    setIsGeneratingAnswer(false);
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
      
      <div className="space-y-3">
        {questions.map((question, index) => (
          <Card key={index} className="overflow-hidden border border-border/50">
            <CardContent className="p-0">
              <div className="flex items-start gap-2 p-3 bg-muted/30">
                <div className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{question.text}</p>
                  {!question.answer && (
                    <Button 
                      onClick={() => handleAskExisting(index)} 
                      variant="ghost" 
                      size="sm" 
                      className="mt-1 h-7 text-xs"
                      disabled={isGeneratingAnswer}
                    >
                      {isGeneratingAnswer ? (
                        <>
                          <Spinner className="h-3 w-3 mr-1" />
                          Generating answer...
                        </>
                      ) : (
                        <>
                          <BrainCircuit className="h-3 w-3 mr-1" />
                          Get AI Answer
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
              
              {question.answer && (
                <div className="p-3 border-t border-border/30 bg-background/80">
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="shrink-0 mt-0.5 bg-primary/5 text-primary text-xs">
                      <BrainCircuit className="h-3 w-3 mr-1" />
                      AI
                    </Badge>
                    <p className="text-xs text-muted-foreground">{question.answer}</p>
                  </div>
                  <p className="text-xs italic mt-2 text-muted-foreground/70">
                    This is an AI-generated response. Please verify with your healthcare provider.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        
        {isAdding && (
          <div className="space-y-2 p-3 border rounded-md bg-muted/20">
            <Textarea
              placeholder="Type your medical question here..."
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="resize-none min-h-[80px]"
            />
            <div className="flex gap-2">
              <Button 
                onClick={handleAddQuestion} 
                size="sm" 
                className="shrink-0"
                disabled={!newQuestion.trim() || isGeneratingAnswer}
              >
                {isGeneratingAnswer ? (
                  <>
                    <Spinner className="h-4 w-4 mr-1" />
                    Generating...
                  </>
                ) : (
                  <>
                    <BrainCircuit className="h-4 w-4 mr-1" />
                    Ask & Save
                  </>
                )}
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
          </div>
        )}
      </div>
      
      <p className="text-xs text-muted-foreground mt-2">
        AI responses are for informational purposes only and do not replace professional medical advice. Always discuss these questions with your healthcare provider.
      </p>
    </div>
  );
};

export default DoctorQuestions;
