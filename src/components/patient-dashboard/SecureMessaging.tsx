
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageSquare, 
  Send, 
  User, 
  ArrowLeft,
  Clock
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  avatarUrl?: string;
}

interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  senderName: string;
}

interface SecureMessagingProps {
  doctors: Doctor[];
  patientId?: string;
}

const SecureMessaging: React.FC<SecureMessagingProps> = ({ 
  doctors,
  patientId = 'p1' // Default value for demo purposes
}) => {
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [messageContent, setMessageContent] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    // Demo messages - in a real app these would come from an API
    {
      id: 'm1',
      senderId: 'dr1',
      recipientId: patientId,
      content: 'Hello! How are you feeling after our last appointment?',
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      isRead: true,
      senderName: 'Dr. Emily Johnson'
    },
    {
      id: 'm2',
      senderId: patientId,
      recipientId: 'dr1',
      content: 'Much better, thank you! The medication has really helped with the pain.',
      timestamp: new Date(Date.now() - 76400000), // 21 hours ago
      isRead: true,
      senderName: 'You'
    },
    {
      id: 'm3',
      senderId: 'dr1',
      recipientId: patientId,
      content: "That's great to hear! Do you have any questions before your next appointment?",
      timestamp: new Date(Date.now() - 72400000), // 20 hours ago
      isRead: false,
      senderName: 'Dr. Emily Johnson'
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages when a new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const startConversation = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setActiveTab('conversation');
  };

  const handleSendMessage = () => {
    if (!messageContent.trim() || !selectedDoctor) return;
    
    // In a real app, this would send the message to an API
    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: patientId,
      recipientId: selectedDoctor.id,
      content: messageContent,
      timestamp: new Date(),
      isRead: false,
      senderName: 'You'
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessageContent('');
    
    toast.success('Message sent', {
      description: `Your message to Dr. ${selectedDoctor.name} has been sent successfully.`,
    });
  };

  const goBack = () => {
    setActiveTab('inbox');
    setSelectedDoctor(null);
  };

  // Group messages by conversation partner
  const conversations = doctors.map(doctor => {
    const doctorMessages = messages.filter(
      m => (m.senderId === doctor.id && m.recipientId === patientId) || 
           (m.senderId === patientId && m.recipientId === doctor.id)
    );
    
    const lastMessage = doctorMessages.length > 0 
      ? doctorMessages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0]
      : null;
      
    const unreadCount = doctorMessages.filter(
      m => m.senderId === doctor.id && !m.isRead
    ).length;
    
    return {
      doctor,
      lastMessage,
      unreadCount
    };
  }).filter(conv => conv.lastMessage !== null);

  return (
    <Card className="shadow-sm border">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Secure Messages
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="inbox" className="mt-0 space-y-4">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="inbox">
                Inbox ({conversations.reduce((acc, conv) => acc + conv.unreadCount, 0)})
              </TabsTrigger>
              <TabsTrigger value="compose">New Message</TabsTrigger>
            </TabsList>

            {conversations.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No messages</p>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                {conversations.map(({ doctor, lastMessage, unreadCount }) => (
                  <div 
                    key={doctor.id}
                    className={`border-b p-4 last:border-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                      unreadCount > 0 ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                    }`}
                    onClick={() => startConversation(doctor)}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(doctor.name)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Dr. {doctor.name}</h4>
                          <span className="text-xs text-muted-foreground">
                            {lastMessage ? format(lastMessage.timestamp, 'MMM d, h:mm a') : ''}
                          </span>
                        </div>
                        
                        <p className="text-sm text-muted-foreground truncate">
                          {lastMessage?.content || ''}
                        </p>
                        
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {doctor.specialty}
                          </span>
                          {unreadCount > 0 && (
                            <Badge variant="secondary" className="text-xs px-2 py-0 h-5">
                              {unreadCount} new
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            )}
          </TabsContent>

          <TabsContent value="compose" className="mt-0 space-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Select Doctor</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {doctors.map(doctor => (
                    <Button
                      key={doctor.id}
                      variant="outline"
                      className="justify-start h-auto py-3"
                      onClick={() => startConversation(doctor)}
                    >
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(doctor.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <p className="font-medium">Dr. {doctor.name}</p>
                        <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="conversation" className="mt-0">
            {selectedDoctor && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Button size="icon" variant="ghost" onClick={goBack}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(selectedDoctor.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Dr. {selectedDoctor.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedDoctor.specialty}</p>
                  </div>
                </div>

                <ScrollArea className="border rounded-md h-[300px] p-4">
                  <div className="space-y-4">
                    {messages
                      .filter(m => 
                        (m.senderId === selectedDoctor.id && m.recipientId === patientId) ||
                        (m.senderId === patientId && m.recipientId === selectedDoctor.id)
                      )
                      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
                      .map(message => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.senderId === patientId ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[80%] px-4 py-2 rounded-lg ${
                              message.senderId === patientId
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <div className="flex items-center mt-1 gap-1">
                              <Clock className="h-3 w-3 text-current opacity-70" />
                              <span className="text-xs opacity-70">
                                {format(message.timestamp, 'MMM d, h:mm a')}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <div className="flex gap-2">
                  <Textarea
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Type your message here..."
                    className="min-h-[80px]"
                  />
                  <Button className="self-end" onClick={handleSendMessage}>
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SecureMessaging;
