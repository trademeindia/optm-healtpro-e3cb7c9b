
import React from 'react';
import { Headset, MessageCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface QuickConnectCardProps {
  unreadMessages?: number;
  onStartChat: () => void;
  onOpenMessages: () => void;
}

const QuickConnectCard: React.FC<QuickConnectCardProps> = ({
  unreadMessages = 0,
  onStartChat,
  onOpenMessages
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Quick Connect</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 flex-1 mr-2"
            onClick={onStartChat}
          >
            <Headset className="h-4 w-4" />
            <span>Start Chat</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2 flex-1 relative"
            onClick={onOpenMessages}
          >
            <MessageCircle className="h-4 w-4" />
            <span>Messages</span>
            {unreadMessages > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {unreadMessages}
              </Badge>
            )}
          </Button>
        </div>
        
        <Button variant="ghost" className="w-full flex items-center justify-center gap-1 text-sm text-muted-foreground">
          View all communication options
          <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickConnectCard;
