
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
    <Card className="overflow-hidden border border-border/30 shadow-sm">
      <CardHeader className="bg-primary/5 pb-3">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Headset className="h-5 w-5 text-primary" />
          Quick Connect
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 flex flex-col h-[calc(100%-58px)]">
        <div className="space-y-3 flex-1">
          <p className="font-medium">
            Need immediate assistance?
          </p>
          <p className="text-sm text-muted-foreground">
            Connect with a specialist for real-time consultation or send messages to your patients.
          </p>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <Card className="bg-primary/5 p-3 border-primary/10">
              <div className="text-center">
                <p className="font-medium text-sm">Available Now</p>
                <p className="text-xs text-muted-foreground mt-1">No wait time</p>
              </div>
            </Card>
            <Card className="bg-primary/5 p-3 border-primary/10">
              <div className="text-center">
                <p className="font-medium text-sm">Support Online</p>
                <p className="text-xs text-muted-foreground mt-1">2 specialists</p>
              </div>
            </Card>
          </div>
        </div>
        
        <div className="space-y-2 mt-4">
          <Button 
            variant="default" 
            className="w-full group justify-between"
            onClick={onStartChat}
          >
            <span className="flex items-center gap-2">
              <Headset className="h-4 w-4" />
              Start Live Chat
            </span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full group justify-between"
            onClick={onOpenMessages}
          >
            <span className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Message Center
              {unreadMessages > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 min-w-5 px-1 rounded-full">
                  {unreadMessages}
                </Badge>
              )}
            </span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickConnectCard;
