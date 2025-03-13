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
  return;
};
export default QuickConnectCard;