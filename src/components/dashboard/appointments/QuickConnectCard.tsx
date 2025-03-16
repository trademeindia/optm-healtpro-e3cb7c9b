
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
        <CardTitle className="text-lg flex items-center gap-2">
          <Headset className="h-5 w-5 text-primary" />
          Quick Connect
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            onClick={onStartChat} 
            className="w-full justify-between"
            variant="default"
          >
            Start video consultation
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          
          <Button 
            onClick={onOpenMessages} 
            className="w-full justify-between"
            variant="outline"
          >
            <div className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-2" />
              Messages
              {unreadMessages > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadMessages}
                </Badge>
              )}
            </div>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickConnectCard;
