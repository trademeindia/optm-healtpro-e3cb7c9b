
import React from 'react';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';

interface TextInputTabProps {
  textInput: string;
  isProcessing: boolean;
  processingProgress: number;
  onTextInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onProcessText: () => void;
}

const TextInputTab: React.FC<TextInputTabProps> = ({
  textInput,
  isProcessing,
  processingProgress,
  onTextInputChange,
  onProcessText
}) => {
  return (
    <div className="space-y-4">
      <Textarea 
        placeholder="Paste your medical report text here (e.g., 'Cholesterol: 210 mg/dL, HDL: 65 mg/dL, LDL: 130 mg/dL...')"
        className="min-h-[200px]"
        value={textInput}
        onChange={onTextInputChange}
      />
      
      {isProcessing ? (
        <div className="space-y-2">
          <div className="flex justify-between text-sm mb-1">
            <span>Analyzing your report...</span>
            <span>{Math.round(processingProgress)}%</span>
          </div>
          <Progress value={processingProgress} />
          <div className="text-xs text-muted-foreground mt-2">
            Our AI is examining your medical data and preparing an easy-to-understand explanation
          </div>
        </div>
      ) : (
        <Button 
          className="w-full" 
          onClick={onProcessText}
          disabled={!textInput.trim()}
        >
          <Zap className="mr-2 h-4 w-4" />
          Analyze Text
        </Button>
      )}
    </div>
  );
};

export default TextInputTab;
