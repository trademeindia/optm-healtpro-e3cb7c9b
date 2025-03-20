
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
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  avatarUrl?: string;
}

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  timestamp?: Date;
  created_at: string;
  read: boolean;
  senderName?: string;
}

interface SecureMessagingProps {
  doctors: Doctor[];
}

const SecureMessaging: React.FC<SecureMessagingProps> = ({ doctors }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [messageContent, setMessageContent] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages from Supabase when a doctor is selected
  useEffect(() => {
    if (!user || !selectedDoctor) return;
    
    const fetchMessages = async () => {
      try {
        setLoading(true);
        
        // Fetch messages between the current user and selected doctor
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .or(`and(sender_id.eq.${user.id},recipient_id.eq.${selectedDoctor.id}),and(sender_id.eq.${selectedDoctor.id},recipient_id.eq.${user.id})`)
          .order('created_at', { ascending: true });
        
        if (error) throw error;
        
        setMessages(data || []);
        
        // Mark unread messages as read
        const unreadMessages = data?.filter(
          m => m.recipient_id === user.id && !m.read
        ) || [];
        
        if (unreadMessages.length > 0) {
          await Promise.all(
            unreadMessages.map(message => 
              supabase
                .from('messages')
                .update({ read: true })
                .eq('id', message.id)
            )
          );
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error('Could not load messages');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
    
    // Set up real-time subscription for new messages
    const messagesSubscription = supabase
      .channel('messages-changes')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `or(and(sender_id=eq.${user.id},recipient_id=eq.${selectedDoctor.id}),and(sender_id=eq.${selectedDoctor.id},recipient_id=eq.${user.id}))`
        }, 
        (payload) => {
          console.log('New message received:', payload);
          // Add the new message to state
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
          
          // Mark message as read if recipient is current user
          if (newMessage.recipient_id === user.id) {
            supabase
              .from('messages')
              .update({ read: true })
              .eq('id', newMessage.id);
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(messagesSubscription);
    };
  }, [user, selectedDoctor]);

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

  const handleSendMessage = async () => {
    if (!messageContent.trim() || !selectedDoctor || !user) return;
    
    try {
      // Insert message into Supabase
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: selectedDoctor.id,
          content: messageContent,
          read: false
        })
        .select();
      
      if (error) throw error;
      
      setMessageContent('');
      
      toast.success('Message sent', {
        description: `Your message to Dr. ${selectedDoctor.name} has been sent.`,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const goBack = () => {
    setActiveTab('inbox');
    setSelectedDoctor(null);
  };

  // Group messages by conversation partner
  const conversations = doctors.map(doctor => {
    const doctorMessages = messages.filter(
      m => (m.sender_id === doctor.id && m.recipient_id === user?.id) || 
           (m.sender_id === user?.id && m.recipient_id === doctor.id)
    );
    
    const lastMessage = doctorMessages.length > 0 
      ? doctorMessages.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
      : null;
      
    const unreadCount = doctorMessages.filter(
      m => m.sender_id === doctor.id && !m.read
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
                            {lastMessage ? format(new Date(lastMessage.created_at), 'MMM d, h:mm a') : ''}
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
                  {loading ? (
                    <div className="flex justify-center items-center h-full">
                      <p className="text-muted-foreground">Loading messages...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.length === 0 ? (
                        <div className="text-center py-4">
                          <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                        </div>
                      ) : (
                        messages.map(message => (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <div
                              className={`max-w-[80%] px-4 py-2 rounded-lg ${
                                message.sender_id === user?.id
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <div className="flex items-center mt-1 gap-1">
                                <Clock className="h-3 w-3 text-current opacity-70" />
                                <span className="text-xs opacity-70">
                                  {format(new Date(message.created_at), 'MMM d, h:mm a')}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </ScrollArea>

                <div className="flex gap-2">
                  <Textarea
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Type your message here..."
                    className="min-h-[80px]"
                  />
                  <Button 
                    className="self-end" 
                    onClick={handleSendMessage}
                    disabled={!messageContent.trim()}
                  >
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
