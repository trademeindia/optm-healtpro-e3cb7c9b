
import React from 'react';
import { BrainCircuit, AlertTriangle, ThumbsUp, ThumbsDown, Bookmark, BookmarkPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Question } from './types';
import { generateAIAnswer } from './utils';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const handleAskExisting = async () => {
    setIsGeneratingAnswer(true);
    const { answer, sources } = await generateAIAnswer(question.text);
    onUpdateQuestion(index, { 
      ...question, 
      answer, 
      sources,
      votes: { helpful: 0, notHelpful: 0 },
      userVoted: null
    });
    setIsGeneratingAnswer(false);
  };

  const handleVote = (voteType: 'helpful' | 'notHelpful') => {
    // Don't allow changing vote type
    if (question.userVoted === voteType) return;

    const currentVotes = question.votes || { helpful: 0, notHelpful: 0 };
    let newVotes = { ...currentVotes };

    // If user already voted, decrement their previous vote
    if (question.userVoted) {
      newVotes[question.userVoted] = Math.max(0, newVotes[question.userVoted] - 1);
    }
    
    // Increment the new vote
    newVotes[voteType] = newVotes[voteType] + 1;

    onUpdateQuestion(index, {
      ...question,
      votes: newVotes,
      userVoted: voteType
    });

    toast({
      description: voteType === 'helpful' 
        ? "Thank you for your feedback! We're glad this was helpful." 
        : "Thank you for your feedback. We'll work to improve our answers.",
      duration: 3000
    });
  };

  const handleToggleFavorite = () => {
    const isFavorited = !question.favorited;
    
    onUpdateQuestion(index, {
      ...question,
      favorited: isFavorited
    });

    toast({
      description: isFavorited 
        ? "Question saved to favorites." 
        : "Question removed from favorites.",
      duration: 2000
    });
  };

  return (
    <Card key={index} className="overflow-hidden border border-border/50">
      <CardContent className="p-0">
        <div className="flex items-start gap-2 p-3 bg-muted/30">
          <div className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
            {index + 1}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium">{question.text}</p>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 ml-2"
                onClick={handleToggleFavorite}
                title={question.favorited ? "Remove from favorites" : "Save to favorites"}
              >
                {question.favorited ? (
                  <Bookmark className="h-4 w-4 text-amber-500" />
                ) : (
                  <BookmarkPlus className="h-4 w-4" />
                )}
              </Button>
            </div>
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
                
                <div className="flex flex-col gap-2 mt-3 pt-2 border-t border-border/20">
                  <div className="flex items-start gap-1">
                    <AlertTriangle className="h-3 w-3 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] italic text-muted-foreground/70">
                      This is an AI-generated response for informational purposes only. 
                      Please verify with your healthcare provider or call +91-9555-9555 for expert assistance.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] text-muted-foreground mr-1">Was this answer helpful?</p>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant={question.userVoted === 'helpful' ? 'default' : 'outline'}
                        className={`h-6 px-2 text-xs ${question.userVoted === 'helpful' ? 'bg-green-500 hover:bg-green-600' : ''}`}
                        onClick={() => handleVote('helpful')}
                      >
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        {question.votes?.helpful || 0}
                      </Button>
                      <Button
                        size="sm"
                        variant={question.userVoted === 'notHelpful' ? 'default' : 'outline'}
                        className={`h-6 px-2 text-xs ${question.userVoted === 'notHelpful' ? 'bg-red-500 hover:bg-red-600' : ''}`}
                        onClick={() => handleVote('notHelpful')}
                      >
                        <ThumbsDown className="h-3 w-3 mr-1" />
                        {question.votes?.notHelpful || 0}
                      </Button>
                    </div>
                  </div>
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
