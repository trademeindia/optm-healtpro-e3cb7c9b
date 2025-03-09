
import React, { useState } from 'react';
import { Plus, HelpCircle, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Question } from './doctor-questions/types';
import { generateAIAnswer } from './doctor-questions/utils';
import SearchForm from './doctor-questions/SearchForm';
import QuestionsList from './doctor-questions/QuestionsList';
import AddQuestionForm from './doctor-questions/AddQuestionForm';

const DoctorQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([
    {
      text: "Should I be concerned about my LDL cholesterol level?",
      answer: "Based on your LDL level of 130 mg/dL, which is borderline high (optimal is <100 mg/dL), some concern is warranted but it's not an emergency. Consider discussing dietary changes with your doctor and possibly scheduling another test in 3-6 months to monitor changes.",
      sources: ["American Heart Association", "Mayo Clinic"],
      favorited: true
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
  const [activeTab, setActiveTab] = useState('all');

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

  const handleSearch = (query: string) => {
    setNewQuestion(query);
    setIsAdding(true);
  };

  const filteredQuestions = activeTab === 'favorites' 
    ? questions.filter(q => q.favorited) 
    : questions;

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border border-border/50">
      <div className="flex flex-col space-y-4">
        <h3 className="text-xl font-semibold text-center">Questions for Your Doctor</h3>
        
        {/* AI Search - Prominently placed at the top */}
        <SearchForm onSearch={handleSearch} />
        
        {/* Tab selection for All/Favorites */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-2">
            <TabsList className="bg-muted/30">
              <TabsTrigger value="all" className="text-sm">All Questions</TabsTrigger>
              <TabsTrigger value="favorites" className="text-sm">
                <Bookmark className="h-3.5 w-3.5 mr-1" />
                Favorites
              </TabsTrigger>
            </TabsList>
            
            {/* Add question button (only shown when not adding) */}
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
          
          <TabsContent value="all" className="mt-0">
            {/* Question editor (shown when adding) */}
            {isAdding && (
              <AddQuestionForm
                newQuestion={newQuestion}
                setNewQuestion={setNewQuestion}
                isGeneratingAnswer={isGeneratingAnswer}
                onAddQuestion={handleAddQuestion}
                onCancel={() => {
                  setIsAdding(false);
                  setNewQuestion('');
                }}
              />
            )}
            
            {/* Questions list */}
            <QuestionsList
              questions={filteredQuestions}
              isGeneratingAnswer={isGeneratingAnswer}
              setIsGeneratingAnswer={setIsGeneratingAnswer}
              setQuestions={setQuestions}
            />
          </TabsContent>
          
          <TabsContent value="favorites" className="mt-0">
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bookmark className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p>No favorite questions saved yet.</p>
                <p className="text-sm">Bookmark important questions to find them quickly later.</p>
              </div>
            ) : (
              <QuestionsList
                questions={filteredQuestions}
                isGeneratingAnswer={isGeneratingAnswer}
                setIsGeneratingAnswer={setIsGeneratingAnswer}
                setQuestions={setQuestions}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
      
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
