'use client';

import { Bot } from 'lucide-react';

export function ChatHeader() {
  return (
    <div className="bg-sky-500 p-4 text-white flex items-center gap-2 rounded-t-lg">
      <Bot className="h-6 w-6" />
      <h2 className="font-semibold">AI Assistant</h2>
    </div>
  );
}