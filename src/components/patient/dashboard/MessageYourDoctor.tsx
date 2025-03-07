
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MessageYourDoctor: React.FC = () => {
  return (
    <div className="glass-morphism rounded-2xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Message Your Doctor</h3>
        <Button variant="ghost" size="sm" className="text-primary">
          View History
        </Button>
      </div>
      <div className="space-y-3">
        <textarea 
          className="w-full p-3 h-24 rounded-lg border resize-none bg-white/80 dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-primary" 
          placeholder="Type your message here..."
        ></textarea>
        <Button className="w-full flex items-center justify-center gap-2">
          <MessageCircle className="h-4 w-4" />
          <span>Send Message</span>
        </Button>
      </div>
    </div>
  );
};

export default MessageYourDoctor;
