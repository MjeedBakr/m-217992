
import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot } from "lucide-react";

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-3 mb-4">
      <Avatar className="bg-uqu-green-600 flex items-center justify-center">
        <AvatarFallback>
          <Bot className="h-5 w-5 text-white" />
        </AvatarFallback>
      </Avatar>
      <div className="message-bubble received">
        <div className="typing">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
    </div>
  );
};
