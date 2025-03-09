
import React, { useState } from 'react';
import { Plus, Check, BrainCircuit, Phone, HelpCircle, Search, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface Question {
  text: string;
  answer?: string;
  sources?: string[];
}

const DoctorQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([
    {
      text: "Should I be concerned about my LDL cholesterol level?",
      answer: "Based on your LDL level of 130 mg/dL, which is borderline high (optimal is <100 mg/dL), some concern is warranted but it's not an emergency. Consider discussing dietary changes with your doctor and possibly scheduling another test in 3-6 months to monitor changes.",
      sources: ["American Heart Association", "Mayo Clinic"]
    },
    {
      text: "What diet changes would you recommend based on these results?",
      answer: "Your cholesterol levels suggest reducing saturated fats (red meat, full-fat dairy) and increasing fiber (oats, beans, fruits, vegetables). Adding heart-healthy fats like olive oil, avocados and nuts may help improve your HDL/LDL ratio. Your doctor can provide personalized recommendations.",
      sources: ["Harvard Health Publication", "Cleveland Clinic"]
    }
  ]);
  
  const [newQuestion, setNewQuestion] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isGeneratingAnswer, setIsGeneratingAnswer] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const generateAIAnswer = async (question: string) => {
    setIsGeneratingAnswer(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate more detailed contextual answers based on the question content
    let answer = "";
    let sources: string[] = [];
    
    if (question.toLowerCase().includes("cholesterol") || question.toLowerCase().includes("ldl")) {
      answer = "Based on your lipid panel, your LDL cholesterol is slightly elevated at 130 mg/dL (optimal <100 mg/dL). This isn't immediately dangerous but warrants attention through diet modification, exercise, and possibly follow-up testing in 3-6 months. Reducing saturated fats and increasing soluble fiber may help lower LDL levels naturally.";
      sources = ["American Heart Association", "Mayo Clinic", "National Lipid Association"];
    } else if (question.toLowerCase().includes("diet") || question.toLowerCase().includes("food") || question.toLowerCase().includes("eat")) {
      answer = "Based on your results, consider a diet rich in soluble fiber (oats, beans, fruits), omega-3 fatty acids (fatty fish, walnuts), and plant sterols. Limit saturated fats and trans fats. The Mediterranean diet has strong evidence supporting heart health. For more personalized advice, consider consulting with a registered dietitian.";
      sources = ["Harvard Health Publication", "Cleveland Clinic", "American College of Cardiology"];
    } else if (question.toLowerCase().includes("vitamin") || question.toLowerCase().includes("supplement")) {
      answer = "Your Vitamin D level is 45 ng/mL, which is within the sufficient range (30-50 ng/mL). Continue your current supplementation if any. Omega-3 supplements may be beneficial if your triglycerides are elevated. For other supplements, consult with your healthcare provider as needs vary based on individual health factors.";
      sources = ["National Institutes of Health", "Endocrine Society", "American Association of Clinical Endocrinology"];
    } else if (question.toLowerCase().includes("exercise") || question.toLowerCase().includes("physical")) {
      answer = "Regular physical activity can help manage your cholesterol levels. Aim for at least 150 minutes of moderate-intensity exercise weekly (e.g., brisk walking, swimming) or 75 minutes of vigorous activity. Resistance training 2-3 times per week is also beneficial. Your healthy blood pressure suggests your current activity level is beneficial.";
      sources = ["American College of Sports Medicine", "CDC", "World Health Organization"];
    } else {
      answer = "This is important to discuss with your healthcare provider at your next appointment. They can provide personalized advice based on your complete medical history and examination. Consider writing down specific concerns to discuss during your visit. For urgent medical questions, please call our expert assistance line.";
      sources = ["Medical Literature"];
    }
    
    setIsGeneratingAnswer(false);
    return { answer, sources };
  };

  const handleAddQuestion = async () => {
    if (newQuestion.trim()) {
      setIsGeneratingAnswer(true);
      const { answer, sources } = await generateAIAnswer(newQuestion.trim());
      setQuestions([...questions, { text: newQuestion.trim(), answer, sources }]);
      setNewQuestion('');
      setIsAdding(false);
      setIsGeneratingAnswer(false);
    }
  };

  const handleAskExisting = async (index: number) => {
    setIsGeneratingAnswer(true);
    const updatedQuestions = [...questions];
    const { answer, sources } = await generateAIAnswer(updatedQuestions[index].text);
    updatedQuestions[index].answer = answer;
    updatedQuestions[index].sources = sources;
    setQuestions(updatedQuestions);
    setIsGeneratingAnswer(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setNewQuestion(searchQuery);
      setIsAdding(true);
      setSearchQuery('');
    }
  };

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border border-border/50">
      <div className="flex flex-col space-y-4">
        <h3 className="text-xl font-semibold text-center">Questions for Your Doctor</h3>
        
        {/* AI Search - Prominently placed at the top */}
        <Card className="bg-primary/5 border border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-primary" />
              Ask Us Any Question
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search medical questions or ask something new..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-background"
                />
              </div>
              <div className="flex justify-between items-center">
                <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90">
                  <BrainCircuit className="h-4 w-4 mr-1" />
                  Get AI Answer
                </Button>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Phone className="h-3 w-3 mr-1 text-primary" />
                  For expert assistance, call +91-9555-9555
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
        
        {/* Add question button (only shown when not adding) */}
        {!isAdding && (
          <div className="flex justify-end">
            <Button 
              onClick={() => setIsAdding(true)} 
              variant="outline" 
              size="sm"
              className="h-8"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Question
            </Button>
          </div>
        )}
      </div>
      
      {/* Question editor (shown when adding) */}
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
      
      {/* Previously asked questions */}
      {questions.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Previously Asked Questions</h4>
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
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground mb-2">{question.answer}</p>
                          
                          {question.sources && question.sources.length > 0 && (
                            <div className="mt-2">
                              <p className="text-[11px] text-muted-foreground/70 font-medium">Sources:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {question.sources.map((source, i) => (
                                  <Badge key={i} variant="secondary" className="text-[10px]">
                                    {source}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-start gap-1 mt-3 pt-2 border-t border-border/20">
                            <AlertTriangle className="h-3 w-3 text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-[10px] italic text-muted-foreground/70">
                              This is an AI-generated response for informational purposes only. 
                              Please verify with your healthcare provider or call +91-9555-9555 for expert assistance.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      <Separator className="my-2" />
      
      {/* Expert assistance information */}
      <div className="flex items-start gap-2 p-2 bg-muted/10 rounded-md">
        <HelpCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-medium mb-1">Need Expert Assistance?</p>
          <p className="text-xs text-muted-foreground">
            For immediate medical questions or concerns, please call our healthcare team at +91-9555-9555.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoctorQuestions;
