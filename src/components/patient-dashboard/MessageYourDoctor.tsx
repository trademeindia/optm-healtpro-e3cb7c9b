
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const MessageYourDoctor: React.FC = () => {
  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          Message Your Doctor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <div className="flex gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/lovable-uploads/d4871440-0787-4dc8-bfbf-20a04c1f96fc.png" alt="Dr. Nikolas Pascal" />
              <AvatarFallback>NP</AvatarFallback>
            </Avatar>
            <div className="bg-muted/50 rounded-lg rounded-tl-none p-3 text-sm flex-1">
              <p className="font-medium text-xs text-primary">Dr. Nikolas Pascal</p>
              <p>How are you feeling after the last treatment session? Any improvements with your mobility?</p>
              <p className="text-xs text-muted-foreground mt-1">Yesterday, 2:45 PM</p>
            </div>
          </div>
          
          <div className="flex gap-3 justify-end">
            <div className="bg-primary/10 rounded-lg rounded-tr-none p-3 text-sm max-w-[80%]">
              <p>Much better! The pain has reduced significantly, and I can move my arm more freely now.</p>
              <p className="text-xs text-primary/70 mt-1 text-right">Yesterday, 3:20 PM</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-end gap-2">
          <Textarea 
            placeholder="Type your message..." 
            className="min-h-[80px]"
          />
          <Button size="icon" className="shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <Button variant="link" className="w-full mt-3">
          View conversation history
        </Button>
      </CardContent>
    </Card>
  );
};

export default MessageYourDoctor;
