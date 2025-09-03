'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message } from './types';
import { ChatHeader } from './ChatHeader';
import { ChatInput } from './ChatInput';

interface ChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatDialog({ open, onOpenChange }: ChatDialogProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: 'Hi! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate bot response (replace with actual API call)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'bot',
        content: "I'm a demo chatbot. This is a simulated response. Replace this with actual API integration!"
      }]);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] h-[600px] flex flex-col p-0">
        <DialogTitle className="sr-only">Chat with AI Assistant</DialogTitle>
        <ChatHeader />
        
        <ScrollArea className="flex-1 p-4">
        </ScrollArea>

        <div className="p-4 border-t">
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={handleSend}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}