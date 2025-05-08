
import React, { useState, useEffect, useRef } from 'react';
import { Message, ChatMessage } from "@/components/chat/Message";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { MessageInput } from "@/components/chat/MessageInput";
import { ReportSummary } from "@/components/chat/ReportSummary";
import { useLostItemReporting } from "@/hooks/useLostItemReporting";

const initialMessages: ChatMessage[] = [
  { 
    id: "1", 
    content: "مرحبا بك في بوت المفقودات بجامعة أم القرى! لتقديم بلاغ عن مفقودات، الرجاء وصف العنصر المفقود بشكل مختصر.", 
    sender: "bot", 
    timestamp: "09:00" 
  },
];

export const ChatMessages = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    isTyping,
    isReportComplete,
    handleNewUserMessage
  } = useLostItemReporting(setMessages);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        
        {isTyping && <TypingIndicator />}
        
        {isReportComplete && <ReportSummary />}
        
        <div ref={messagesEndRef} />
      </div>

      <MessageInput onSendMessage={handleNewUserMessage} />
    </div>
  );
};

export default ChatMessages;
