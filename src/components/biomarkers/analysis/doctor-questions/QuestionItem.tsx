
import React from 'react';
import { BrainCircuit, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Question } from './types';
import { generateAIAnswer } from './utils';

interface QuestionItemProps {
  question: Question;
  index: number;
  isGeneratingAnswer: boolean;
  setIsGeneratingAnswer: (value: boolean) => void;
  onUpdateQuestion: (index: number, updatedQuestion: Question) => void;
}

const QuestionItem: React.FC<QuestionItemProps> = ({
  question,
  index,
  isGeneratingAnswer,
  setIsGeneratingAnswer,
  onUpdateQuestion,
}) => {
  const handleAskExisting = async () => {
    setIsGeneratingAnswer(true);
    const { answer, sources } = await generateAIAnswer(question.text);
    onUpdateQuestion(index, { ...question, answer, sources });
    setIsGeneratingAnswer(false);
  };

  return (
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
                onClick={handleAskExisting} 
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
  );
};

export default QuestionItem;
