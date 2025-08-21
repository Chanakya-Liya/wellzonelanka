'use client';

import { Bot } from 'lucide-react';

interface ChatButtonProps {
  onClick: () => void;
}

export function ChatButton({ onClick }: ChatButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed right-4 bottom-10 transform -translate-y-1/2 z-50 bg-sky-500 p-4 rounded-full shadow-lg hover:bg-sky-600 transition-colors justify-center animate-bounce"
    >
      <Bot className="h-8 w-8 text-white" />
    </button>
  );
}