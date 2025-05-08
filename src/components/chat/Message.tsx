
import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";

export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: string;
}

interface MessageProps {
  message: ChatMessage;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  return (
    <div key={message.id} className={`flex items-start gap-3 mb-4 ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
      <Avatar className={`${message.sender === "bot" ? "bg-uqu-green-600" : "bg-gray-200"} flex items-center justify-center`}>
        <AvatarFallback>
          {message.sender === "user" ? (
            <User className="h-5 w-5 text-gray-500" />
          ) : (
            <Bot className="h-5 w-5 text-white" />
          )}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1 max-w-[75%]">
        <div className={`message-bubble ${message.sender === "user" ? "sent" : "received"}`}>
          {message.content}
        </div>
        <div className={`text-xs text-muted ${message.sender === "user" ? "text-left" : "text-right"}`}>
          {message.timestamp}
        </div>
      </div>
    </div>
  );
};
